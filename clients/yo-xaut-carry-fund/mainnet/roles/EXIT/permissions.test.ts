import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { compoundV3, morpho, USDC, USDT, XAUt, yo } from "@/addresses/eth"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const erc20 = () => kit.asMember.weth
const pool = () => kit.asMember.aaveV3.poolCoreV3
const vault = (address: string) => kit.asMember.morpho.vault.attach(address)
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)
const edge = () => kit.asMember.yo.edgeVault.attach(yo.usdEdge)

describe("yo-xaut-carry-fund mainnet EXIT", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: loan and supply exit", () => {
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

    it("withdraws XAUt and USDC to the avatar only", async () => {
      await expect(pool().withdraw(XAUt, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(USDC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(XAUt, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(USDC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(USDT, 1n, avatar.address)).toBeForbidden()
    })

    it("cannot supply, borrow or switch eMode", async () => {
      await expect(pool().supply(XAUt, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().setUserEMode(43)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Compound v3 ciUSDCv3: USDC", () => {
    it("withdraws USDC", async () => {
      await expect(comet().withdraw(USDC, 1n)).toBeAllowed()
    })

    it("cannot deposit: supply(USDC) and the USDC approval to the Comet are forbidden", async () => {
      await expect(comet().supply(USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("does not scope collateral or third-party variants", async () => {
      await expect(comet().withdraw(XAUt, 1n)).toBeForbidden()
      await expect(comet().withdrawTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Morpho Vaults: exit legs only", () => {
    const vaults = [
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdcYieldRWA,
      morpho.kpkUsdcPrimeV2,
      morpho.kpkYoEcosystem,
    ]

    it.each(vaults)(
      "withdraws and redeems on %s to the avatar, from the avatar only",
      async (v) => {
        await expect(
          vault(v).withdraw(1n, avatar.address, avatar.address)
        ).toBeAllowed()
        await expect(
          vault(v).redeem(1n, avatar.address, avatar.address)
        ).toBeAllowed()
        await expect(
          vault(v).withdraw(1n, stranger, avatar.address)
        ).toBeForbidden(Status.ParameterNotAllowed)
        await expect(
          vault(v).redeem(1n, avatar.address, stranger)
        ).toBeForbidden(Status.ParameterNotAllowed)
      }
    )

    it.each(vaults)(
      "force deallocates on %s on behalf of the avatar only",
      async (v) => {
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, avatar.address)
        ).toBeAllowed()
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, stranger)
        ).toBeForbidden(Status.ParameterNotAllowed)
      }
    )

    it.each(vaults)(
      "cannot approve USDC to, deposit into or mint on %s",
      async (v) => {
        await expect(
          erc20().attach(USDC).approve(v, parseUnits("1", 6))
        ).toBeForbidden()
        await expect(vault(v).deposit(1n, avatar.address)).toBeForbidden(
          Status.FunctionNotAllowed
        )
        await expect(vault(v).mint(1n, avatar.address)).toBeForbidden(
          Status.FunctionNotAllowed
        )
      }
    )

    it("forbids any other vault", async () => {
      await expect(
        vault(morpho.kpkUsdtPrimeV2).withdraw(
          1n,
          avatar.address,
          avatar.address
        )
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("yoUSD Edge (YO Protocol): exit only", () => {
    it("requests a redeem and redeems with receiver and owner pinned to the avatar", async () => {
      await expect(
        edge().requestRedeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(
        edge().redeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(
        edge().requestRedeem(1n, stranger, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(edge().redeem(1n, avatar.address, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("cannot approve USDC to, deposit into, withdraw from or mint on the Edge vault", async () => {
      await expect(
        erc20().attach(USDC).approve(yo.usdEdge, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(edge().deposit(1n, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(
        edge().withdraw(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(edge().mint(1n, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })
})
