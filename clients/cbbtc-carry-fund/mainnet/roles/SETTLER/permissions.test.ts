import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, compoundV3, USDC, WBTC } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

// Bluechip Spoke reserve 1 (WBTC, Prime Hub): not listed in addresses.ts, WBTC has its own fund
const wbtcPrime = 1

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const erc20 = () => kit.asMember.weth
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)
const pool = () => kit.asMember.aaveV3.poolCoreV3
const bluechip = () => kit.asMember.aaveV4.bluechipSpoke

describe("cbbtc-carry-fund mainnet SETTLER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
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
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden()
    })

    it("withdraws cbBTC to the avatar only", async () => {
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(cbBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    // The defi-kit deposit action leaves the flag unpinned (as on the XAUt SETTLER), so the role
    // can also turn cbBTC off as collateral. Aave refuses that if it would push the HF below 1.
    it("toggles cbBTC as collateral either way, and no other reserve", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(cbBTC, true)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(cbBTC, false)
      ).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(USDC, true)
      ).toBeForbidden()
    })

    it("claims Aave v3 incentives to the avatar only (part of the defi-kit deposit action)", async () => {
      const incentives = () => kit.asMember.aaveV3.incentivesV3
      await expect(
        incentives().claimRewards([cbBTC], 1n, avatar.address, cbBTC)
      ).toBeAllowed()
      await expect(
        incentives().claimRewards([cbBTC], 1n, stranger, cbBTC)
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

  describe("Aave v3 Core: no WBTC (WBTC has its own fund)", () => {
    it("does not approve, supply, withdraw or toggle WBTC", async () => {
      await expect(
        erc20().attach(WBTC).approve(poolCoreV3, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeForbidden()
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, true)
      ).toBeForbidden()
    })
  })

  describe("Compound v3 Institutional (ciUSDCv3): not scoped (does not take cbBTC)", () => {
    it("does not approve, supply or withdraw on the Comet", async () => {
      await expect(
        erc20().attach(cbBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(
        erc20().attach(WBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(comet().supply(cbBTC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().withdraw(cbBTC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
      await expect(comet().supply(WBTC, 1n)).toBeForbidden(
        Status.TargetAddressNotAllowed
      )
    })
  })

  describe("Aave v4 Bluechip: cbBTC collateral (reserve 2)", () => {
    it("approves cbBTC to the Spoke, not WBTC", async () => {
      await expect(
        erc20().attach(cbBTC).approve(bluechipSpoke, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(bluechipSpoke, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("supplies, withdraws and toggles cbBTC for the avatar only", async () => {
      const r = aaveV4BluechipReserve.cbbtcPrime
      await expect(bluechip().supply(r, 1n, avatar.address)).toBeAllowed()
      await expect(bluechip().supply(r, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(bluechip().withdraw(r, 1n, avatar.address)).toBeAllowed()
      await expect(bluechip().withdraw(r, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(
        bluechip().setUsingAsCollateral(r, true, avatar.address)
      ).toBeAllowed()
    })

    it("does not supply or withdraw WBTC (reserve 1)", async () => {
      await expect(
        bluechip().supply(wbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        bluechip().withdraw(wbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
    })
  })
})
