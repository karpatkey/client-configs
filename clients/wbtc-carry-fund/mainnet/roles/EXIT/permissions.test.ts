import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, USDC, USDT, WBTC } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3

describe("wbtc-carry-fund mainnet EXIT", () => {
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

    it("withdraws WBTC to the avatar only", async () => {
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(WBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeForbidden()
    })

    it("never borrows or supplies", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("unchanged boundaries", () => {
    it("still withdraws WBTC from Aave v4 to the avatar only", async () => {
      const bluechip = () => kit.asMember.aaveV4.bluechipSpoke
      await expect(
        bluechip().withdraw(aaveV4BluechipReserve.wbtcPrime, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().withdraw(aaveV4BluechipReserve.wbtcPrime, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
