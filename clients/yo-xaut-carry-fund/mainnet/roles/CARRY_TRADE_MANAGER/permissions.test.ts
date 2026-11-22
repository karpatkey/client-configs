import { MaxUint256, parseUnits } from "ethers"
import { Clearance, processPermissions } from "zodiac-roles-sdk"
import { applyPermissions } from "@/test/helpers"
import { preprocessPermissions } from "../../../../../helpers/apply"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { compoundV3, morpho, USDC, USDG, USDT, XAUt, yo } from "@/addresses/eth"
import { parameters } from "../../instances/sub_prod"
import { parameters as mainParameters } from "../../instances/main_prod"
import managerCalls from "../MANAGER/permissions/calls"
import managerActions from "../MANAGER/permissions/_actions"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3
const vault = (address: string) => kit.asMember.morpho.vault.attach(address)
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)

describe("yo-xaut-carry-fund mainnet CARRY_TRADE_MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: XAUt collateral", () => {
    it("approves XAUt to the Pool, including a reset to 0, not to a stranger", async () => {
      await expect(erc20().attach(XAUt).approve(poolCoreV3, 0n)).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("supplies, enables as collateral (true only) and withdraws XAUt for the avatar", async () => {
      await expect(pool().supply(XAUt, 1n, avatar.address, 0)).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, true)
      ).toBeAllowed()
      await expect(pool().withdraw(XAUt, 1n, avatar.address)).toBeAllowed()
      await expect(
        pool().withdraw(XAUt, MaxUint256, avatar.address)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, false)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(pool().supply(XAUt, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(XAUt, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not switch eMode", async () => {
      await expect(pool().setUserEMode(43)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Aave v3 Core: USDC debt", () => {
    it("approves USDC to the Pool, including a reset to 0", async () => {
      await expect(erc20().attach(USDC).approve(poolCoreV3, 0n)).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
    })

    it("borrows and repays USDC for the avatar only", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
      await expect(pool().borrow(USDC, 1n, 2, 0, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().repay(USDC, 1n, 2, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not borrow USDT or USDG", async () => {
      await expect(
        pool().borrow(USDT, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        pool().borrow(USDG, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
    })

    it("does not supply or withdraw USDC on the Pool", async () => {
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(USDC, 1n, avatar.address)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })
  })

  describe("Morpho Vaults: the USDC menu", () => {
    const vaults = [
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdcYieldRWA,
      morpho.kpkYoEcosystem,
    ]

    it.each(vaults)(
      "approves, deposits and withdraws on %s (avatar only)",
      async (v) => {
        await expect(erc20().attach(USDC).approve(v, 0n)).toBeAllowed()
        await expect(
          erc20().attach(USDC).approve(v, parseUnits("1", 6))
        ).toBeAllowed()
        await expect(vault(v).deposit(1n, avatar.address)).toBeAllowed()
        await expect(
          vault(v).withdraw(1n, avatar.address, avatar.address)
        ).toBeAllowed()
        await expect(vault(v).deposit(1n, stranger)).toBeForbidden(
          Status.ParameterNotAllowed
        )
        await expect(
          vault(v).withdraw(1n, stranger, avatar.address)
        ).toBeForbidden(Status.ParameterNotAllowed)
        await expect(
          vault(v).withdraw(1n, avatar.address, stranger)
        ).toBeForbidden(Status.ParameterNotAllowed)
      }
    )

    it.each(vaults)(
      "forbids redeem, mint and force deallocate on %s (a plain withdraw pulls through the liquidity adapter)",
      async (v) => {
        await expect(
          vault(v).redeem(1n, avatar.address, avatar.address)
        ).toBeForbidden(Status.FunctionNotAllowed)
        await expect(vault(v).mint(1n, avatar.address)).toBeForbidden(
          Status.FunctionNotAllowed
        )
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, avatar.address)
        ).toBeForbidden(Status.FunctionNotAllowed)
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, stranger)
        ).toBeForbidden(Status.FunctionNotAllowed)
      }
    )

    it("does not touch kpk USDC Prime v2 or a USDT vault", async () => {
      const prime = morpho.kpkUsdcPrimeV2
      await expect(
        erc20().attach(USDC).approve(prime, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(vault(prime).deposit(1n, avatar.address)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(
        vault(prime).withdraw(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
      await expect(
        vault(morpho.kpkUsdtPrimeV2).deposit(1n, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("yoUSD Edge (YO Protocol): not scoped, the MANAGER enters and exits it", () => {
    const edge = () => kit.asMember.yo.edgeVault.attach(yo.usdEdge)

    it("does not approve USDC to the Edge vault", async () => {
      await expect(
        erc20().attach(USDC).approve(yo.usdEdge, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("cannot deposit, request a redeem or redeem", async () => {
      await expect(edge().deposit(1n, avatar.address)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(
        edge().requestRedeem(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
      await expect(
        edge().redeem(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("Compound v3 ciUSDCv3: not scoped", () => {
    it("does not approve USDC, supply or withdraw", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(comet().supply(USDC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().withdraw(USDC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
    })
  })

  describe("MANAGER superset", () => {
    // The Sub modifier calls through MANAGER on the Exec modifier: a (target, selector) the
    // MANAGER lacks would revert in production.
    const expand = async (
      actions: any,
      calls: any,
      params: typeof parameters
    ) =>
      processPermissions(
        await preprocessPermissions(
          { allowedActions: actions, allowedCalls: calls },
          params
        )
      ).targets

    it("allows every (target, selector) of CARRY_TRADE_MANAGER", async () => {
      const carry = await expand(allowedActions, allowedCalls, parameters)
      const manager = await expand(managerActions, managerCalls, mainParameters)
      const managerKeys = new Set(
        manager.flatMap((t) =>
          t.clearance === Clearance.Target
            ? [`${t.address.toLowerCase()}:*`]
            : (t.functions ?? []).map(
                (f) => `${t.address.toLowerCase()}:${f.selector}`
              )
        )
      )
      const missing = carry.flatMap((t) =>
        (t.functions ?? [])
          .map((f) => `${t.address.toLowerCase()}:${f.selector}`)
          .filter(
            (k) =>
              !managerKeys.has(k) && !managerKeys.has(`${k.split(":")[0]}:*`)
          )
      )
      expect(carry.length).toBeGreaterThan(0)
      expect(missing).toEqual([])
    })
  })
})
