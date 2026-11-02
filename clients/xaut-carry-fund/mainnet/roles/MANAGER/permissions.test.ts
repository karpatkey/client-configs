import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { morpho, USDC } from "@/addresses/eth"
import { parameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const erc20 = () => kit.asMember.weth
const vault = (address: string) => kit.asMember.morpho.vault.attach(address)
const yo = morpho.kpkYoEcosystem

describe("xaut-carry-fund mainnet MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Morpho Vault - YO Ecosystem Vault", () => {
    it("approves USDC to the vault, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(yo, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("deposits for the avatar only", async () => {
      await expect(vault(yo).deposit(1n, avatar.address)).toBeAllowed()
      await expect(vault(yo).deposit(1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("withdraws and redeems to the avatar, from the avatar only", async () => {
      await expect(
        vault(yo).withdraw(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(
        vault(yo).redeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(
        vault(yo).withdraw(1n, stranger, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        vault(yo).withdraw(1n, avatar.address, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        vault(yo).redeem(1n, stranger, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        vault(yo).redeem(1n, avatar.address, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("force deallocates on behalf of the avatar only", async () => {
      await expect(
        vault(yo).forceDeallocate(stranger, "0x", 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        vault(yo).forceDeallocate(stranger, "0x", 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("forbids mint and any other vault", async () => {
      await expect(vault(yo).mint(1n, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(
        vault(morpho.kpkUsdcPrimeV2).deposit(1n, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })
})
