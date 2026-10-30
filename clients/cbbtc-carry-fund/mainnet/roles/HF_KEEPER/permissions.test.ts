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

describe("cbbtc-carry-fund mainnet HF_KEEPER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: USDC debt leg of aave_v3_health_factor_manager", () => {
    it("approves USDC to the Pool, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("borrows USDC for the avatar only", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().borrow(USDC, 1n, 2, 0, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("repays USDC for the avatar only", async () => {
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("forbids other debt assets and any collateral movement", async () => {
      await expect(
        pool().borrow(USDT, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeForbidden()
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeForbidden()
    })
  })

  describe("Aave v4 Bluechip: frxUSD repay only (reserve 8)", () => {
    it("approves frxUSD to the Spoke, not to a stranger", async () => {
      await expect(
        erc20().attach(frxUSD).approve(bluechipSpoke, parseUnits("1", 18))
      ).toBeAllowed()
      await expect(
        erc20().attach(frxUSD).approve(stranger, parseUnits("1", 18))
      ).toBeForbidden()
    })

    it("repays frxUSD for the avatar only", async () => {
      await expect(
        bluechip().repay(aaveV4BluechipReserve.frxusdCore, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().repay(aaveV4BluechipReserve.frxusdCore, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("never borrows frxUSD", async () => {
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.frxusdCore, 1n, avatar.address)
      ).toBeForbidden()
    })
  })

  describe("Compound v3 Institutional (ciUSDCv3): not scoped (does not take cbBTC)", () => {
    it("does not approve, borrow or repay on the Comet", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(comet().withdraw(USDC, parseUnits("1", 6))).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().supply(USDC, parseUnits("1", 6))).toBeForbidden(
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
        curve()["exchange(int128,int128,uint256,uint256)"](0, 0, 1n, 0n)
      ).toBeForbidden()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256,address)"](
          0,
          1,
          1n,
          0n,
          avatar.address
        )
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        erc20().attach(USDT).approve(curvePool, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDG).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })

  describe("unchanged boundaries", () => {
    it("still borrows USDC on the Aave v4 Core line for the avatar only", async () => {
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdcCore, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdcCore, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("still borrows USDG (11) for the avatar only, and never supplies collateral", async () => {
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdgCore, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdgCore, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        bluechip().supply(aaveV4BluechipReserve.cbbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        bluechip().supply(wbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
    })
  })
})
