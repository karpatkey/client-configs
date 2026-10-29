import { id, keccak256, parseUnits, toUtf8Bytes } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import {
  cbBTC,
  cirBTC,
  compoundV3,
  cowSwap,
  frxUSD,
  GHO,
  maple,
  morpho,
  syrupUSDC,
  syrupUSDG,
  syrupUSDT,
  USDC,
  USDG,
  USDT,
  WBTC,
  WETH,
  wstETH,
} from "@/addresses/eth"
import { aaveV4BluechipReserve, aaveV4MapleReserve } from "../../addresses"
import { parameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

// MarketParams of the Morpho Blue markets the tests call. The policy pins them by id through
// defi-kit (`morphoMarkets.borrow` in _actions.ts), so a call is allowed only if these
// params hash to a whitelisted id.
const morphoMarkets = {
  // 0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64 - NOT whitelisted:
  // cbBTC gets its own fund
  cbBtcUsdc: {
    loanToken: USDC,
    collateralToken: cbBTC,
    oracle: morpho.oracleCbBtcUsdc,
    irm: morpho.adaptativeCurveIrm,
    lltv: "860000000000000000",
  },
  // 0x729badf297ee9f2f6b3f717b96fd355fc6ec00422284ce1968e76647b258cf44
  syrupUsdcUsdc: {
    loanToken: USDC,
    collateralToken: syrupUSDC,
    oracle: morpho.oraclesyrupUsdcUsdc,
    irm: morpho.adaptativeCurveIrm,
    lltv: "915000000000000000",
  },
  // 0x7ddde63e40deefdd5940120f58f88be7a4d11e709335a2024e3b616afbdf7120 - NOT whitelisted: its
  // oracle samples 1 wei of syrupUSDC, so it prices syrupUSDC at exactly 1.00 instead of ~1.19
  syrupUsdcUsdcParOracle: {
    loanToken: USDC,
    collateralToken: syrupUSDC,
    oracle: "0x4F570BcEaC722f277c5BAAA374D4D69AC095Cd46",
    irm: morpho.adaptativeCurveIrm,
    lltv: "915000000000000000",
  },
  // 0xa4774e3e693fff2ebd1dcbbd69b1b0a5b9bb0ccc753bfda5dd07bdac97c4818a
  syrupUsdtUsdt: {
    loanToken: USDT,
    collateralToken: syrupUSDT,
    oracle: morpho.oraclesyrupUsdtUsdt,
    irm: morpho.adaptativeCurveIrm,
    lltv: "915000000000000000",
  },
}

const erc20 = () => kit.asMember.weth
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)

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

  describe("A - no cbBTC (cbBTC gets its own fund)", () => {
    const spoke = contracts.mainnet.aaveV4.bluechipSpoke

    it("does not approve cbBTC to the Bluechip Spoke, the shares contract or CowSwap", async () => {
      for (const spender of [
        spoke,
        parameters.shares,
        cowSwap.gpv2VaultRelayer,
      ]) {
        await expect(
          erc20().attach(cbBTC).approve(spender, parseUnits("1", 8))
        ).toBeForbidden()
      }
    })

    it("does not supply, withdraw or enable cbBTC (reserve 2) on the Bluechip Spoke", async () => {
      const r = aaveV4BluechipReserve.cbbtcPrime
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.supply(r, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.withdraw(r, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.setUsingAsCollateral(
          r,
          true,
          avatar.address
        )
      ).toBeForbidden()
    })

    it("forbids supplying an unpinned Bluechip reserve (3 = wstETH)", async () => {
      await expect(
        kit.asMember.aaveV4.bluechipSpoke.supply(3, 1n, avatar.address)
      ).toBeForbidden()
    })

    it("approves WBTC to the shares contract, including a reset to 0", async () => {
      await expect(
        erc20().attach(WBTC).approve(parameters.shares, 0n)
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(parameters.shares, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("does not swap cbBTC on CowSwap", async () => {
      await expect(cowOrder(cbBTC, USDC)).toBeForbidden()
      await expect(cowOrder(WBTC, cbBTC)).toBeForbidden()
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

    it("forbids the Maple Spoke USDC reserve (2) and borrowing syrupUSDG (1)", async () => {
      await expect(
        kit.asMember.aaveV4.mapleSpoke.borrow(2, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        kit.asMember.aaveV4.mapleSpoke.supply(2, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        kit.asMember.aaveV4.mapleSpoke.borrow(
          aaveV4MapleReserve.syrupUsdg,
          1n,
          avatar.address
        )
      ).toBeForbidden()
    })
  })

  describe("C - syrupUSDT loop on Morpho Blue", () => {
    const morphoBlue = contracts.mainnet.morpho.morphoBlue
    const market = morphoMarkets.syrupUsdtUsdt

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

  describe("D - Aave v4: pinned reserves on the Bluechip and Maple Spokes only", () => {
    const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
    const mapleSpoke = contracts.mainnet.aaveV4.mapleSpoke
    // Aave v4 Main Spoke, not scoped: stands in for every other Spoke
    const mainSpoke = "0x94e7A5dCbE816e498b89aB752661904E2F56c485"
    const bluechip = () => kit.asMember.aaveV4.bluechipSpoke

    it("borrows and repays USDC Prime (4), USDC Core (7) and frxUSD Core (8) on Bluechip", async () => {
      await expect(
        erc20().attach(USDC).approve(bluechipSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(frxUSD).approve(bluechipSpoke, parseUnits("1", 18))
      ).toBeAllowed()
      for (const r of [
        aaveV4BluechipReserve.usdcPrime,
        aaveV4BluechipReserve.usdcCore,
        aaveV4BluechipReserve.frxusdCore,
      ]) {
        await expect(bluechip().borrow(r, 1n, avatar.address)).toBeAllowed()
        await expect(bluechip().repay(r, 1n, avatar.address)).toBeAllowed()
      }
    })

    it("forbids borrowing BTC and any unpinned Bluechip reserve", async () => {
      for (const r of [
        aaveV4BluechipReserve.wbtcPrime,
        aaveV4BluechipReserve.cbbtcPrime,
        3, // wstETH
        10, // USDT Core
      ]) {
        await expect(bluechip().borrow(r, 1n, avatar.address)).toBeForbidden()
      }
    })

    it("forbids supplying a stablecoin or enabling it as collateral", async () => {
      await expect(
        bluechip().supply(aaveV4BluechipReserve.usdcCore, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        bluechip().setUsingAsCollateral(
          aaveV4BluechipReserve.usdgCore,
          true,
          avatar.address
        )
      ).toBeForbidden()
    })

    it("forbids acting for a third party", async () => {
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdcCore, 1n, stranger)
      ).toBeForbidden()
      await expect(
        bluechip().repay(aaveV4BluechipReserve.frxusdCore, 1n, stranger)
      ).toBeForbidden()
    })

    it("refreshes the avatar's own risk premium and dynamic config on both Spokes", async () => {
      for (const spoke of [bluechip(), kit.asMember.aaveV4.mapleSpoke]) {
        await expect(spoke.updateUserRiskPremium(avatar.address)).toBeAllowed()
        await expect(
          spoke.updateUserDynamicConfig(avatar.address)
        ).toBeAllowed()
        await expect(spoke.updateUserRiskPremium(stranger)).toBeForbidden(
          Status.ParameterNotAllowed
        )
      }
    })

    it("forbids every other Spoke", async () => {
      const other = bluechip().attach(mainSpoke)
      await expect(other.supply(0, 1n, avatar.address)).toBeForbidden()
      await expect(other.borrow(7, 1n, avatar.address)).toBeForbidden()
      await expect(
        erc20().attach(USDG).approve(mainSpoke, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("forbids position managers and multicall", async () => {
      await expect(
        bluechip().setUserPositionManager(stranger, true)
      ).toBeForbidden()
      await expect(
        bluechip().renouncePositionManagerRole(avatar.address)
      ).toBeForbidden()
      await expect(bluechip().multicall([])).toBeForbidden()
    })

    it("approves only the pinned tokens to each Spoke", async () => {
      await expect(
        erc20().attach(cirBTC).approve(bluechipSpoke, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(mapleSpoke, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDG).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })

  describe("E - CowSwap sets", () => {
    it("swaps USDG <-> USDC both ways (borrow USDG, deploy USDC, swap back to repay)", async () => {
      await expect(cowOrder(USDG, USDC)).toBeAllowed()
      await expect(cowOrder(USDC, USDG)).toBeAllowed()
      await expect(cowOrder(GHO, USDT)).toBeAllowed()
    })

    it("keeps stablecoins other than USDC away from the BTC collateral", async () => {
      await expect(cowOrder(USDG, WBTC)).toBeForbidden()
      await expect(cowOrder(WBTC, USDT)).toBeForbidden()
    })

    it("swaps WBTC <-> USDC, but into no other BTC wrapper", async () => {
      await expect(cowOrder(WBTC, USDC)).toBeAllowed()
      await expect(cowOrder(USDC, WBTC)).toBeAllowed()
      await expect(cowOrder(WBTC, cirBTC)).toBeForbidden()
      await expect(cowOrder(cirBTC, WBTC)).toBeForbidden()
      await expect(cowOrder(cbBTC, cirBTC)).toBeForbidden()
    })

    it("sells syrup tokens for stablecoins, but never buys them on CowSwap", async () => {
      await expect(cowOrder(syrupUSDG, USDG)).toBeAllowed()
      await expect(cowOrder(syrupUSDT, USDT)).toBeAllowed()
      await expect(cowOrder(syrupUSDC, USDC)).toBeAllowed()
      await expect(cowOrder(USDC, syrupUSDC)).toBeForbidden()
    })
  })

  describe("F - Aave v3 Core: backup borrow venue, syrupUSDT loop, cirBTC", () => {
    const pool = () => kit.asMember.aaveV3.poolCoreV3

    it("supplies WBTC and syrupUSDT and borrows USDG for the avatar", async () => {
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(
        pool().supply(syrupUSDT, 1n, avatar.address, 0)
      ).toBeAllowed()
      await expect(pool().borrow(USDG, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().supply(WBTC, 1n, stranger, 0)).toBeForbidden()
    })

    it("does not supply cbBTC (cbBTC gets its own fund)", async () => {
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden()
    })

    it("switches e-mode (33 = syrupUSDT stablecoins)", async () => {
      await expect(pool().setUserEMode(33)).toBeAllowed()
    })

    it("supplies and withdraws cirBTC once listed", async () => {
      await expect(pool().supply(cirBTC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(pool().withdraw(cirBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(cirBTC, 1n, stranger)).toBeForbidden()
    })
  })

  describe("G - Morpho Blue backup markets and the syrupUSDC loop", () => {
    it("does not use the USDC/cbBTC market (cbBTC gets its own fund)", async () => {
      const m = morphoMarkets.cbBtcUsdc
      await expect(
        kit.asMember.morpho.morphoBlue.supplyCollateral(
          m,
          1n,
          avatar.address,
          "0x"
        )
      ).toBeForbidden()
      await expect(
        kit.asMember.morpho.morphoBlue.borrow(
          m,
          1n,
          0n,
          avatar.address,
          avatar.address
        )
      ).toBeForbidden()
    })

    it("loops syrupUSDC: router deposit and the 91.5% syrupUSDC/USDC market", async () => {
      await expect(
        erc20().attach(USDC).approve(maple.syrupUsdcRouter, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupRouter
          .attach(maple.syrupUsdcRouter)
          .deposit(parseUnits("1", 6), id("kpk"))
      ).toBeAllowed()
      await expect(
        kit.asMember.morpho.morphoBlue.supplyCollateral(
          morphoMarkets.syrupUsdcUsdc,
          1n,
          avatar.address,
          "0x"
        )
      ).toBeAllowed()
      await expect(
        kit.asMember.maple.syrupPool
          .attach(syrupUSDC)
          .requestRedeem(1n, avatar.address)
      ).toBeAllowed()
    })

    it("forbids the second syrupUSDC/USDC market (oracle pinned at 1.00)", async () => {
      await expect(
        kit.asMember.morpho.morphoBlue.supplyCollateral(
          morphoMarkets.syrupUsdcUsdcParOracle,
          1n,
          avatar.address,
          "0x"
        )
      ).toBeForbidden()
      await expect(
        kit.asMember.morpho.morphoBlue.borrow(
          morphoMarkets.syrupUsdcUsdcParOracle,
          1n,
          0n,
          avatar.address,
          avatar.address
        )
      ).toBeForbidden()
    })
  })

  describe("H - Compound v3 Institutional (ciUSDCv3): WBTC collateral, USDC debt", () => {
    it("approves WBTC and USDC to the Comet only", async () => {
      for (const [token, unit] of [
        [WBTC, parseUnits("1", 8)],
        [USDC, parseUnits("1", 6)],
      ] as const) {
        await expect(
          erc20().attach(token).approve(compoundV3.ciUSDCv3, unit)
        ).toBeAllowed()
        await expect(
          erc20().attach(token).approve(stranger, unit)
        ).toBeForbidden()
      }
    })

    it("supplies collateral and repays: supply(WBTC / USDC)", async () => {
      await expect(comet().supply(WBTC, 1n)).toBeAllowed()
      await expect(comet().supply(USDC, parseUnits("1", 6))).toBeAllowed()
    })

    it("withdraws collateral and borrows: withdraw(WBTC / USDC)", async () => {
      await expect(comet().withdraw(WBTC, 1n)).toBeAllowed()
      await expect(comet().withdraw(USDC, parseUnits("1", 6))).toBeAllowed()
    })

    it("forbids cbBTC / WETH / wstETH collateral", async () => {
      await expect(
        erc20().attach(cbBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(comet().supply(cbBTC, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().withdraw(cbBTC, 1n)).toBeForbidden(
        Status.OrViolation
      )
      await expect(comet().supply(WETH, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().withdraw(wstETH, 1n)).toBeForbidden(
        Status.OrViolation
      )
    })

    it("forbids the To / From variants, manager delegation and transfers", async () => {
      await expect(comet().supplyTo(stranger, WBTC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(
        comet().supplyFrom(avatar.address, stranger, WBTC, 1n)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(comet().withdrawTo(stranger, USDC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(
        comet().withdrawFrom(avatar.address, stranger, USDC, 1n)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(comet().allow(stranger, true)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().transfer(stranger, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().transferAsset(stranger, WBTC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })

    it("forbids the Comet on the main cUSDCv3 market", async () => {
      await expect(
        kit.asMember.compoundV3.comet.supply(WBTC, 1n)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("I - Curve USDG/USDC atomic swap", () => {
    const curvePool = contracts.mainnet.curve.usdgUsdcPool
    const curve = () => kit.asMember.curve.usdgUsdcPool

    it("approves USDC and USDG to the pool and swaps both ways", async () => {
      await expect(
        erc20().attach(USDC).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](0, 1, 1000000n, 0n)
      ).toBeAllowed()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](1, 0, 1000000n, 0n)
      ).toBeAllowed()
    })

    it("forbids other coin indices, the receiver variant and other tokens", async () => {
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](0, 0, 1n, 0n)
      ).toBeForbidden()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256,address)"](
          0,
          1,
          1n,
          0n,
          avatar.address
        )
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        erc20().attach(USDT).approve(curvePool, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })
})
