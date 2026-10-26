import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, compoundV3, USDC, WBTC, WETH } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)
const pool = () => kit.asMember.aaveV3.poolCoreV3

describe("wbtc-carry-fund mainnet SETTLER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: WBTC collateral for subscriptions and redemptions", () => {
    it("approves WBTC to the Pool, not to a stranger", async () => {
      await expect(
        erc20().attach(WBTC).approve(poolCoreV3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("supplies WBTC for the avatar only", async () => {
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().supply(WBTC, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden()
    })

    it("withdraws WBTC to the avatar only", async () => {
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(WBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    // The defi-kit deposit action leaves the flag unpinned (as on the XAUt SETTLER), so the role
    // can also turn WBTC off as collateral. Aave refuses that if it would push the HF below 1.
    it("toggles WBTC as collateral either way, and no other reserve", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, true)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, false)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(USDC, true)
      ).toBeForbidden()
    })

    it("claims Aave v3 incentives to the avatar only (part of the defi-kit deposit action)", async () => {
      const incentives = () => kit.asMember.aaveV3.incentivesV3
      await expect(
        incentives().claimRewards([WBTC], 1n, avatar.address, WBTC)
      ).toBeAllowed()
      await expect(
        incentives().claimRewards([WBTC], 1n, stranger, WBTC)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("never borrows or repays", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Aave v3 Core: cbBTC collateral for subscriptions and redemptions", () => {
    it("approves cbBTC to the Pool, not to a stranger", async () => {
      await expect(
        erc20().attach(cbBTC).approve(poolCoreV3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(cbBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("supplies cbBTC for the avatar only", async () => {
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().supply(cbBTC, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("withdraws cbBTC to the avatar only", async () => {
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(cbBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("toggles cbBTC as collateral either way", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(cbBTC, true)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(cbBTC, false)
      ).toBeAllowed()
    })
  })

  describe("Compound v3 Institutional (ciUSDCv3): WBTC and cbBTC collateral", () => {
    it("approves WBTC and cbBTC to the Comet, not to a stranger or USDC", async () => {
      await expect(
        erc20().attach(WBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(cbBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("supplies and withdraws WBTC and cbBTC", async () => {
      await expect(comet().supply(WBTC, 1n)).toBeAllowed()
      await expect(comet().supply(cbBTC, 1n)).toBeAllowed()
      await expect(comet().withdraw(WBTC, 1n)).toBeAllowed()
      await expect(comet().withdraw(cbBTC, 1n)).toBeAllowed()
    })

    it("cannot borrow, repay, use other collateral or the To / allow variants", async () => {
      await expect(comet().withdraw(USDC, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().supply(USDC, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().supply(WETH, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().supplyTo(stranger, WBTC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().withdrawTo(stranger, WBTC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().allow(stranger, true)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("unchanged boundaries", () => {
    it("still supplies WBTC on Aave v4 for the avatar only", async () => {
      const bluechip = () => kit.asMember.aaveV4.bluechipSpoke
      await expect(
        bluechip().supply(aaveV4BluechipReserve.wbtcPrime, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().supply(aaveV4BluechipReserve.wbtcPrime, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
