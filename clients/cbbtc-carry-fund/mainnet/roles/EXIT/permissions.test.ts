import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import {
  cbBTC,
  compoundV3,
  frxUSD,
  USDC,
  USDG,
  USDT,
  WBTC,
} from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

// Bluechip Spoke reserve 1 (WBTC, Prime Hub): not listed in addresses.ts, WBTC has its own fund
const wbtcPrime = 1

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const curvePool = contracts.mainnet.curve.usdgUsdcPool
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const bluechip = () => kit.asMember.aaveV4.bluechipSpoke
const curve = () => kit.asMember.curve.usdgUsdcPool
const erc20 = () => kit.asMember.weth
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)
const pool = () => kit.asMember.aaveV3.poolCoreV3

describe("cbbtc-carry-fund mainnet EXIT", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: loan_position_exit unwind", () => {
    it("approves USDC to the Pool, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("repays USDC for the avatar only", async () => {
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().repay(USDT, 1n, 2, avatar.address)).toBeForbidden()
    })

    it("withdraws cbBTC to the avatar only", async () => {
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(cbBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(USDT, 1n, avatar.address)).toBeForbidden()
    })

    it("does not withdraw WBTC", async () => {
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeForbidden()
    })

    it("never borrows or supplies", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Aave v4 Bluechip: frxUSD not scoped (reserve 8)", () => {
    it("does not approve, repay or borrow frxUSD", async () => {
      await expect(
        erc20().attach(frxUSD).approve(bluechipSpoke, parseUnits("1", 18))
      ).toBeForbidden()
      await expect(
        bluechip().repay(aaveV4BluechipReserve.frxusdCore, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.frxusdCore, 1n, avatar.address)
      ).toBeForbidden()
    })
  })

  describe("Compound v3 Institutional (ciUSDCv3): not scoped (does not take cbBTC)", () => {
    it("does not approve, supply or withdraw on the Comet", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(comet().supply(USDC, parseUnits("1", 6))).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().withdraw(cbBTC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().withdraw(WBTC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
    })
  })

  describe("Curve USDG/USDC atomic swap", () => {
    it("approves USDC and USDG to the pool", async () => {
      await expect(
        erc20().attach(USDC).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
    })

    it("swaps USDG -> USDC (0 -> 1) and USDC -> USDG (1 -> 0)", async () => {
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](0, 1, 1000000n, 0n)
      ).toBeAllowed()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](1, 0, 1000000n, 0n)
      ).toBeAllowed()
    })

    it("forbids other coin indices, the receiver variant and other spenders", async () => {
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](1, 1, 1n, 0n)
      ).toBeForbidden()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256,address)"](
          1,
          0,
          1n,
          0n,
          avatar.address
        )
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        erc20().attach(USDT).approve(curvePool, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })

  describe("unchanged boundaries", () => {
    it("still withdraws cbBTC (reserve 2) from Aave v4 to the avatar only", async () => {
      await expect(
        bluechip().withdraw(
          aaveV4BluechipReserve.cbbtcPrime,
          1n,
          avatar.address
        )
      ).toBeAllowed()
      await expect(
        bluechip().withdraw(aaveV4BluechipReserve.cbbtcPrime, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("does not withdraw WBTC (reserve 1) from Aave v4", async () => {
      await expect(
        bluechip().withdraw(wbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
    })

    it("still repays USDG (11) for the avatar, and never borrows", async () => {
      await expect(
        bluechip().repay(aaveV4BluechipReserve.usdgCore, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdgCore, 1n, avatar.address)
      ).toBeForbidden()
    })
  })
})
