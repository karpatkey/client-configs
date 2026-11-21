import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { USDC, XAUt } from "@/addresses/eth"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3
const incentives = () => kit.asMember.aaveV3.incentivesV3

describe("yo-xaut-carry-fund mainnet SETTLER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: XAUt collateral for subscriptions and redemptions", () => {
    it("approves XAUt to the Pool, including a reset to 0, not to a stranger", async () => {
      await expect(erc20().attach(XAUt).approve(poolCoreV3, 0n)).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("supplies and withdraws XAUt for the avatar only", async () => {
      await expect(pool().supply(XAUt, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().withdraw(XAUt, 1n, avatar.address)).toBeAllowed()
      await expect(pool().supply(XAUt, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(XAUt, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not toggle XAUt as collateral, either way", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, true)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, false)
      ).toBeForbidden(Status.FunctionNotAllowed)
    })

    it("does not claim Aave incentives", async () => {
      await expect(
        incentives().claimRewards([XAUt], 1n, avatar.address, XAUt)
      ).toBeForbidden()
    })

    it("does not touch USDC (no borrow, repay, supply, withdraw, approve)", async () => {
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().withdraw(USDC, 1n, avatar.address)).toBeForbidden()
      await expect(
        pool().borrow(USDC, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })
})
