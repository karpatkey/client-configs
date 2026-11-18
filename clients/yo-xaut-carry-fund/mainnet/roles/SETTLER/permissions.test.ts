import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { USDC, XAUt } from "@/addresses/eth"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3

describe("yo-xaut-carry-fund mainnet SETTLER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: XAUt collateral for subscriptions and redemptions", () => {
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

    it("does not touch USDC (no borrow, repay, supply)", async () => {
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(
        pool().borrow(USDC, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })
})
