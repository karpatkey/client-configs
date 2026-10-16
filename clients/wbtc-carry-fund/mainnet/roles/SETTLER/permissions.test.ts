import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, USDC, WBTC } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3

describe("wbtc-carry-fund mainnet SETTLER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: WBTC collateral for subscriptions and redemptions", () => {
    it("approves WBTC to the Pool, and to no one else", async () => {
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
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden()
    })

    it("withdraws WBTC to the avatar only", async () => {
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(WBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("enables WBTC as collateral", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, true)
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
