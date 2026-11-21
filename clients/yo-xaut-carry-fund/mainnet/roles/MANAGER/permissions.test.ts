import { id, keccak256, parseUnits, toUtf8Bytes } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { compoundV3, morpho, USDC, USDG, USDT, XAUt, yo } from "@/addresses/eth"
import { parameters } from "../../instances/main_prod"
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

const cowOrder = (sellToken: string, buyToken: string, kind = "sell") =>
  kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
    {
      sellToken,
      buyToken,
      sellAmount: 1000000n,
      buyAmount: 1n,
      feeAmount: 0n,
      receiver: avatar.address,
      validTo: Math.round(Date.now() / 1000) + 30 * 60,
      kind: id(kind),
      partiallyFillable: false,
      sellTokenBalance: id("erc20"),
      buyTokenBalance: id("erc20"),
      appData: keccak256(toUtf8Bytes("TEST")),
    },
    30 * 60,
    0
  )

describe("yo-xaut-carry-fund mainnet MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("Aave v3 Core: XAUt collateral, USDC debt and supply, eMode 43", () => {
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

    it("borrows and repays USDC for the avatar only", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
      await expect(pool().borrow(USDC, 1n, 2, 0, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("supplies and withdraws USDC for the avatar only", async () => {
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().withdraw(USDC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().supply(USDC, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not borrow or supply USDT or USDG", async () => {
      await expect(
        pool().borrow(USDT, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        pool().borrow(USDG, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(pool().supply(USDT, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().supply(USDG, 1n, avatar.address, 0)).toBeForbidden()
    })

    it("approves USDC and XAUt to the Pool, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("sets eMode 43 only", async () => {
      await expect(pool().setUserEMode(43)).toBeAllowed()
      await expect(pool().setUserEMode(1)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })
  })

  describe("CowSwap: XAUt <-> USDC only", () => {
    it("swaps XAUt and USDC both ways", async () => {
      await expect(cowOrder(XAUt, USDC)).toBeAllowed()
      await expect(cowOrder(USDC, XAUt)).toBeAllowed()
    })

    it("does not swap any other stablecoin", async () => {
      await expect(cowOrder(USDC, USDT)).toBeForbidden()
      await expect(cowOrder(USDC, USDG)).toBeForbidden()
      await expect(cowOrder(XAUt, USDT)).toBeForbidden()
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
      "approves USDC to, deposits into, withdraws and redeems from %s (avatar only)",
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

    it("forbids mint and a stranger vault", async () => {
      await expect(
        vault(morpho.kpkYoEcosystem).mint(1n, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        vault(morpho.kpkUsdtPrimeV2).deposit(1n, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("Compound v3 ciUSDCv3: USDC supply only", () => {
    it("approves USDC to the Comet, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("supplies and withdraws USDC", async () => {
      await expect(comet().supply(USDC, 1n)).toBeAllowed()
      await expect(comet().withdraw(USDC, 1n)).toBeAllowed()
    })

    it("does not supply or withdraw any collateral, nor act for others", async () => {
      await expect(comet().supply(XAUt, 1n)).toBeForbidden()
      await expect(comet().withdraw(XAUt, 1n)).toBeForbidden()
      await expect(comet().supplyTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().withdrawTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().allow(stranger, true)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("yoUSD Edge (YO Protocol): async-exit ERC-4626", () => {
    it("approves USDC to the Edge vault, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(yo.usdEdge, parseUnits("1", 6))
      ).toBeAllowed()
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
      await expect(
        edge().requestRedeem(1n, stranger, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(edge().redeem(1n, avatar.address, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("does not scope withdraw (it always reverts) or mint", async () => {
      await expect(
        edge().withdraw(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(edge().mint(1n, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Shares contract allowance", () => {
    it("approves XAUt to the shares contract, including a reset to 0", async () => {
      await expect(
        erc20().attach(XAUt).approve(parameters.shares, 0n)
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(parameters.shares, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(XAUt).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(parameters.shares, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })
})
