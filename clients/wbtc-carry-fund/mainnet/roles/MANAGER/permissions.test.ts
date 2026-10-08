import { id, keccak256, parseUnits, toUtf8Bytes } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import {
  cbBTC,
  cowSwap,
  maple,
  syrupUSDG,
  syrupUSDT,
  USDC,
  USDG,
  USDT,
  WBTC,
} from "@/addresses/eth"
import {
  aaveV4BluechipReserve,
  aaveV4MapleReserve,
  morphoSyrupUsdtUsdtMarket,
} from "../../addresses"
import { parameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const erc20 = () => kit.asMember.weth

const cowOrder = (sellToken: string, buyToken: string) =>
  kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
    {
      sellToken,
      buyToken,
      sellAmount: 1000000n,
      buyAmount: 1n,
      feeAmount: 0n,
      receiver: avatar.address,
      validTo: Math.round(Date.now() / 1000) + 30 * 60,
      kind: id("sell"),
      partiallyFillable: false,
      sellTokenBalance: id("erc20"),
      buyTokenBalance: id("erc20"),
      appData: keccak256(toUtf8Bytes("TEST")),
    },
    30 * 60,
    0
  )

describe("wbtc-carry-fund mainnet MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("A - cbBTC as second collateral on the Aave v4 Bluechip Spoke", () => {
    const spoke = contracts.mainnet.aaveV4.bluechipSpoke

    it("approves cbBTC to the Bluechip Spoke", async () => {
      await expect(
        erc20().attach(cbBTC).approve(spoke, parseUnits("1", 8))
      ).toBeAllowed()
    })

    it("supplies, withdraws and enables cbBTC (reserve 2) for the avatar", async () => {
      const r = aaveV4BluechipReserve.cbbtcPrime
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.supply(r, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.withdraw(r, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.setUsingAsCollateral(
          r,
          true,
          avatar.address
        )
      ).toBeAllowed()
    })

    it("forbids cbBTC supply on behalf of a third party", async () => {
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.supply(
          aaveV4BluechipReserve.cbbtcPrime,
          1n,
          stranger
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("forbids supplying an unscoped reserve (3 = wstETH)", async () => {
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.supply(3, 1n, avatar.address)
      ).toBeForbidden()
    })

    it("approves WBTC and cbBTC to the shares contract, including a reset to 0", async () => {
      await expect(
        erc20().attach(cbBTC).approve(parameters.shares, 0n)
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(parameters.shares, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(cbBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("swaps cbBTC to USDC on CowSwap", async () => {
      await expect(
        erc20()
          .attach(cbBTC)
          .approve(cowSwap.gpv2VaultRelayer, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        kit.asMember.cowSwap.orderSigner.signOrder.delegateCall(
          {
            sellToken: cbBTC,
            buyToken: USDC,
            sellAmount: parseUnits("1", 8),
            buyAmount: parseUnits("1", 6),
            feeAmount: 0n,
            receiver: avatar.address,
            validTo: Math.round(Date.now() / 1000) + 30 * 60,
            kind: id("sell"),
            partiallyFillable: false,
            sellTokenBalance: id("erc20"),
            buyTokenBalance: id("erc20"),
            appData: keccak256(toUtf8Bytes("TEST")),
          },
          30 * 60,
          0
        )
      ).toBeAllowed()
    })
  })

  describe("B - syrupUSDG loop on Aave v4", () => {
    const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
    const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke
    const router = () =>
      kit.asMember.maple.syrupRouter.attach(maple.syrupUsdgRouter)
    const pool = () => kit.asMember.maple.syrupPool.attach(syrupUSDG)

    it("borrows and repays USDG on the Bluechip Spoke Core Hub line (reserve 11)", async () => {
      const r = aaveV4BluechipReserve.usdgCore
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.borrow(r, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(bluechipSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.repay(r, 1n, avatar.address)
      ).toBeAllowed()
    })

    it("forbids borrowing USDG on behalf of a third party", async () => {
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.borrow(
          aaveV4BluechipReserve.usdgCore,
          1n,
          stranger
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("deposits USDG into syrupUSDG through its SyrupRouter", async () => {
      await expect(
        erc20().attach(USDG).approve(maple.syrupUsdgRouter, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        router().deposit(parseUnits("1", 6), id("kpk"))
      ).toBeAllowed()
      await expect(
        router().authorizeAndDeposit(
          16n,
          0n,
          27,
          id("r"),
          id("s"),
          parseUnits("1", 6),
          id("kpk")
        )
      ).toBeAllowed()
    })

    it("requests, cancels and redeems syrupUSDG for the avatar only", async () => {
      await expect(pool().requestRedeem(1n, avatar.address)).toBeAllowed()
      await expect(pool().removeShares(1n, avatar.address)).toBeAllowed()
      await expect(
        pool().redeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
      await expect(pool().redeem(1n, stranger, avatar.address)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(
        pool().withdraw(1n, avatar.address, avatar.address)
      ).toBeForbidden(Status.FunctionNotAllowed)
    })

    it("supplies syrupUSDG as collateral on the Maple Spoke (reserve 1)", async () => {
      const r = aaveV4MapleReserve.syrupUsdg
      await expect(
        erc20().attach(syrupUSDG).approve(mapleSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.mapleSpoke.supply(r, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.mapleSpoke.setUsingAsCollateral(
          r,
          true,
          avatar.address
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.aaveV4.mapleSpoke.withdraw(r, 1n, avatar.address)
      ).toBeAllowed()
    })

    it("borrows and repays USDG on the Maple Spoke (reserves 0 and 3)", async () => {
      await expect(
        erc20().attach(USDG).approve(mapleSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      for (const r of [
        aaveV4MapleReserve.usdgGlobalDollar,
        aaveV4MapleReserve.usdgCore,
      ]) {
        await expect(
          kit.asMember.aaveV4.mapleSpoke.borrow(r, 1n, avatar.address)
        ).toBeAllowed()
        await expect(
          kit.asMember.aaveV4.mapleSpoke.repay(r, 1n, avatar.address)
        ).toBeAllowed()
      }
    })

    it("forbids borrowing the Maple Spoke USDC reserve (2)", async () => {
      await expect(
        kit.asMember.aaveV4.mapleSpoke.borrow(2, 1n, avatar.address)
      ).toBeForbidden()
    })
  })

  describe("C - syrupUSDT loop on Morpho Blue", () => {
    const morphoBlue = contracts.mainnet.morpho.morphoBlue
    const market = morphoSyrupUsdtUsdtMarket

    it("swaps USDC <-> USDT on CowSwap, approving USDT from 0", async () => {
      await expect(
        erc20().attach(USDT).approve(cowSwap.gpv2VaultRelayer, 0n)
      ).toBeAllowed()
      await expect(cowOrder(USDC, USDT)).toBeAllowed()
      await expect(cowOrder(USDT, USDC)).toBeAllowed()
    })

    it("does not make USDT tradable against the BTC collateral", async () => {
      await expect(cowOrder(USDT, cbBTC)).toBeForbidden()
      await expect(cowOrder(WBTC, USDT)).toBeForbidden()
    })

    it("deposits USDT into syrupUSDT through its SyrupRouter and exits", async () => {
      await expect(
        erc20().attach(USDT).approve(maple.syrupUsdtRouter, 0n)
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupRouter.deposit(1000000n, id("kpk"))
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupRouter.authorizeAndDeposit(
          16n,
          0n,
          27,
          id("r"),
          id("s"),
          1000000n,
          id("kpk")
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupPool.requestRedeem(1n, avatar.address)
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupPool.removeShares(1n, avatar.address)
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupPool.redeem(1n, avatar.address, avatar.address)
      ).toBeAllowed()
    })

    it("supplies/withdraws syrupUSDT and borrows/repays USDT on the pinned market", async () => {
      await expect(
        erc20().attach(syrupUSDT).approve(morphoBlue, 1n)
      ).toBeAllowed()
      await expect(erc20().attach(USDT).approve(morphoBlue, 0n)).toBeAllowed()
      await expect(
        kit.asMember.morpho.morphoBlue.supplyCollateral(
          market,
          1n,
          avatar.address,
          "0x"
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.morpho.morphoBlue.borrow(
          market,
          1n,
          0n,
          avatar.address,
          avatar.address
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.morpho.morphoBlue.repay(
          market,
          1n,
          0n,
          avatar.address,
          "0x"
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.morpho.morphoBlue.withdrawCollateral(
          market,
          1n,
          avatar.address,
          avatar.address
        )
      ).toBeAllowed()
    })

    it("forbids another market, a third-party receiver, and callback data", async () => {
      await expect(
        kit.asMember.morpho.morphoBlue.borrow(
          { ...market, lltv: "860000000000000000" },
          1n,
          0n,
          avatar.address,
          avatar.address
        )
      ).toBeForbidden()
      await expect(
        kit.asMember.morpho.morphoBlue.borrow(
          market,
          1n,
          0n,
          avatar.address,
          stranger
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(
        kit.asMember.morpho.morphoBlue.supplyCollateral(
          market,
          1n,
          avatar.address,
          "0x01"
        )
      ).toBeForbidden()
    })
  })
})
