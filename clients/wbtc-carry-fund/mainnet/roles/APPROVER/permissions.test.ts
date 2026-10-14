import { Contract } from "ethers"
import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import { getProvider } from "@/test/provider"
import { getRolesMod } from "@/test/rolesMod"
import { Status } from "@/test/types"
import {
  SETTLEMENT_GUARD_ALLOWANCE_KEY,
  SettlementGuard,
  TODO_OPS,
} from "@/helpers"
import { XAUt } from "@/addresses/eth"
// main_prod, not manager_prod: same `shares`, and manager_prod carries TODO_OPS placeholders
// that ts-jest would reject until ops fill them. Only `shares` is used by the policy.
import { parameters } from "../../instances/main_prod"
import allowedCalls, { settlementAssets } from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// Test fixtures only, never recommendations: the band is derived from the fork's last
// settled prices and the budget is the smallest one that lets a single call through.
const FIXTURE_PERIOD = 365 * 24 * 60 * 60

const sharesView = () =>
  new Contract(
    parameters.shares,
    ["function getLastSettledPrice(address) view returns (uint256)"],
    getProvider()
  )

const setBudget = async (balance: number) => {
  const tx = await (
    await getRolesMod()
  ).setAllowance(
    SETTLEMENT_GUARD_ALLOWANCE_KEY,
    balance,
    1,
    1,
    FIXTURE_PERIOD,
    0
  )
  await tx.wait()
}

const settle = (asset: string, price: bigint) =>
  kit.asMember.oiv.shares
    .attach(parameters.shares)
    .processRequests([], [], asset, price)

describe("wbtc-carry-fund APPROVER - OIV settlement guard", () => {
  let min = 0n
  let max = 0n
  let guard: SettlementGuard

  beforeAll(async () => {
    const shares = sharesView()
    const prices: bigint[] = []
    for (const asset of settlementAssets)
      prices.push(await shares.getFunction("getLastSettledPrice")(asset))
    min = prices.reduce((a, b) => (a < b ? a : b))
    max = prices.reduce((a, b) => (a > b ? a : b)) + 1n
    guard = {
      sharesPriceMin: min.toString(),
      sharesPriceMax: max.toString(),
      callAllowance: {
        balance: 1,
        maxRefill: 1,
        refill: 1,
        periodSeconds: FIXTURE_PERIOD,
      },
    }
    await applyPermissions(
      { allowedActions, allowedCalls },
      { ...parameters, settlementGuard: guard }
    )
    await setBudget(1)
  })

  it("allows every pinned asset at both band edges (inclusive)", async () => {
    for (const asset of settlementAssets) {
      await expect(settle(asset, min)).toBeAllowed()
      await expect(settle(asset, max)).toBeAllowed()
    }
  })

  it("forbids a price below sharesPriceMin", async () => {
    for (const asset of settlementAssets)
      await expect(settle(asset, min - 1n)).toBeForbidden(
        Status.ParameterLessThanAllowed
      )
  })

  it("forbids a price above sharesPriceMax", async () => {
    for (const asset of settlementAssets)
      await expect(settle(asset, max + 1n)).toBeForbidden(
        Status.ParameterGreaterThanAllowed
      )
  })

  it("forbids an asset outside the pin", async () => {
    await expect(settle(XAUt, min)).toBeForbidden()
  })

  it("forbids any call when the call budget is empty", async () => {
    await setBudget(0)
    for (const asset of settlementAssets)
      await expect(settle(asset, min)).toBeForbidden(
        Status.CallAllowanceExceeded
      )
    await setBudget(1)
  })

  describe("config validation", () => {
    const withGuard = (g: unknown) => () =>
      allowedCalls({ ...parameters, settlementGuard: g as SettlementGuard })

    it("throws when settlementGuard is missing", () => {
      expect(() => allowedCalls({ ...parameters })).toThrow(/missing/)
    })

    it("throws while a value is still TODO_OPS", () => {
      expect(withGuard({ ...guard, sharesPriceMin: TODO_OPS })).toThrow(
        /TODO_OPS/
      )
      expect(
        withGuard({
          ...guard,
          callAllowance: { ...guard.callAllowance, refill: TODO_OPS },
        })
      ).toThrow(/TODO_OPS/)
    })

    it("throws when the band is empty or inverted", () => {
      expect(
        withGuard({ ...guard, sharesPriceMax: guard.sharesPriceMin })
      ).toThrow(/lower/)
      expect(
        withGuard({
          ...guard,
          sharesPriceMin: guard.sharesPriceMax,
          sharesPriceMax: guard.sharesPriceMin,
        })
      ).toThrow(/lower/)
    })

    it("throws on a price that is not a positive integer string", () => {
      expect(withGuard({ ...guard, sharesPriceMin: "1.5" })).toThrow(/integer/)
      expect(withGuard({ ...guard, sharesPriceMax: Number(max) })).toThrow(
        /integer/
      )
    })

    it("throws on an unlimited (0) or incomplete call budget", () => {
      expect(
        withGuard({
          ...guard,
          callAllowance: { ...guard.callAllowance, maxRefill: 0 },
        })
      ).toThrow(/maxRefill/)
      expect(withGuard({ ...guard, callAllowance: undefined })).toThrow(
        /callAllowance/
      )
    })
  })
})
