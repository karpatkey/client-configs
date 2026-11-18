import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { compoundV3, morpho, USDC, USDG, USDT, XAUt, yo } from "@/addresses/eth"
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

describe("yo-xaut-carry-fund mainnet CARRY_TRADE_MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: XAUt collateral", () => {
    it("approves XAUt to the Pool, including a reset to 0, not to a stranger", async () => {
      await expect(erc20().attach(XAUt).approve(poolCoreV3, 0n)).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("supplies, enables as collateral (true only) and withdraws XAUt for the avatar", async () => {
      await expect(pool().supply(XAUt, 1n, avatar.address, 0)).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, true)
      ).toBeAllowed()
      await expect(pool().withdraw(XAUt, 1n, avatar.address)).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(XAUt, false)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(pool().supply(XAUt, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(XAUt, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not switch eMode", async () => {
      await expect(pool().setUserEMode(43)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Aave v3 Core: USDC debt and supply", () => {
    it("borrows and repays USDC for the avatar only", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
      await expect(pool().borrow(USDC, 1n, 2, 0, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().repay(USDC, 1n, 2, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not borrow USDT or USDG", async () => {
      await expect(
        pool().borrow(USDT, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        pool().borrow(USDG, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
    })

    it("supplies and withdraws USDC for the avatar only", async () => {
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().withdraw(USDC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().supply(USDC, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(USDC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().supply(USDT, 1n, avatar.address, 0)).toBeForbidden()
    })
  })

  describe("Morpho Vaults: the USDC menu", () => {
    const vaults = [
      morpho.kpkUsdcYieldV2,
      morpho.kpkUsdcYieldRWA,
      morpho.kpkUsdcPrimeV2,
      morpho.kpkYoEcosystem,
    ]

    it.each(vaults)(
      "approves, deposits, withdraws and redeems on %s (avatar only)",
      async (v) => {
        await expect(
          erc20().attach(USDC).approve(v, parseUnits("1", 6))
        ).toBeAllowed()
        await expect(vault(v).deposit(1n, avatar.address)).toBeAllowed()
        await expect(
          vault(v).withdraw(1n, avatar.address, avatar.address)
        ).toBeAllowed()
        await expect(
          vault(v).redeem(1n, avatar.address, avatar.address)
        ).toBeAllowed()
        await expect(vault(v).deposit(1n, stranger)).toBeForbidden(
          Status.ParameterNotAllowed
        )
        await expect(
          vault(v).withdraw(1n, stranger, avatar.address)
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

    it("forbids mint and a USDT vault", async () => {
      await expect(
        vault(morpho.kpkYoEcosystem).mint(1n, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        vault(morpho.kpkUsdtPrimeV2).deposit(1n, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("yoUSD Edge (YO Protocol): deposit and exit", () => {
    const edge = () => kit.asMember.yo.edgeVault.attach(yo.usdEdge)

    it("approves USDC to the Edge vault, not to a stranger or another token", async () => {
      await expect(
        erc20().attach(USDC).approve(yo.usdEdge, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDT).approve(yo.usdEdge, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("deposits for the avatar only", async () => {
      await expect(edge().deposit(1n, avatar.address)).toBeAllowed()
      await expect(edge().deposit(1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("requests a redeem and redeems with receiver and owner pinned to the avatar", async () => {
      await expect(
        edge().requestRedeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(
        edge().redeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
    })

    it("forbids a stranger controller/receiver or owner on requestRedeem and redeem", async () => {
      await expect(
        edge().requestRedeem(1n, stranger, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        edge().requestRedeem(1n, avatar.address, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(edge().redeem(1n, stranger, avatar.address)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(edge().redeem(1n, avatar.address, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("cannot withdraw (it always reverts) or mint on the Edge vault", async () => {
      await expect(
        edge().withdraw(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(edge().mint(1n, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Compound v3 ciUSDCv3: USDC supply only", () => {
    it("approves USDC, supplies and withdraws USDC", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(comet().supply(USDC, 1n)).toBeAllowed()
      await expect(comet().withdraw(USDC, 1n)).toBeAllowed()
    })

    it("does not scope collateral or third-party variants", async () => {
      await expect(comet().supply(XAUt, 1n)).toBeForbidden()
      await expect(comet().withdraw(XAUt, 1n)).toBeForbidden()
      await expect(comet().supplyTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().withdrawTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })
})
