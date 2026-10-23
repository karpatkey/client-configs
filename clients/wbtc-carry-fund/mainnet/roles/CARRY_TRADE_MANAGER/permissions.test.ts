import { id, keccak256, parseUnits, toUtf8Bytes } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import {
  cbBTC,
  compoundV3,
  cowSwap,
  morpho,
  USDC,
  USDG,
  USDT,
  WBTC,
} from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const bluechipSpoke = contracts.mainnet.aaveV4.bluechipSpoke
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const curvePool = contracts.mainnet.curve.usdgUsdcPool

const erc20 = () => kit.asMember.weth
const bluechip = () => kit.asMember.aaveV4.bluechipSpoke
const pool = () => kit.asMember.aaveV3.poolCoreV3
const curve = () => kit.asMember.curve.usdgUsdcPool
const vault = (address: string) => kit.asMember.morpho.vault.attach(address)
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)

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

describe("wbtc-carry-fund mainnet CARRY_TRADE_MANAGER", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, parameters)
  })

  describe("A - WBTC collateral on the Aave v4 Bluechip Spoke (reserve 1)", () => {
    const r = aaveV4BluechipReserve.wbtcPrime

    it("approves WBTC to the Spoke, including a reset to 0", async () => {
      await expect(
        erc20().attach(WBTC).approve(bluechipSpoke, 0n)
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(bluechipSpoke, parseUnits("1", 8))
      ).toBeAllowed()
    })

    it("supplies, enables as collateral and withdraws WBTC for the avatar", async () => {
      await expect(bluechip().supply(r, 1n, avatar.address)).toBeAllowed()
      await expect(
        bluechip().setUsingAsCollateral(r, true, avatar.address)
      ).toBeAllowed()
      await expect(bluechip().withdraw(r, 1n, avatar.address)).toBeAllowed()
    })

    it("forbids disabling WBTC as collateral", async () => {
      await expect(
        bluechip().setUsingAsCollateral(r, false, avatar.address)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("forbids cbBTC (reserve 2) and acting for a third party", async () => {
      await expect(
        bluechip().supply(aaveV4BluechipReserve.cbbtcPrime, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        erc20().attach(cbBTC).approve(bluechipSpoke, parseUnits("1", 8))
      ).toBeForbidden()
      await expect(bluechip().supply(r, 1n, stranger)).toBeForbidden()
      await expect(bluechip().withdraw(r, 1n, stranger)).toBeForbidden()
    })
  })

  describe("B - USDC (7) and USDG (11) debt on the Core Hub lines", () => {
    it("borrows and repays USDC Core (7) and USDG Core (11) for the avatar", async () => {
      await expect(
        erc20().attach(USDC).approve(bluechipSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(bluechipSpoke, parseUnits("1", 6))
      ).toBeAllowed()
      for (const r of [
        aaveV4BluechipReserve.usdcCore,
        aaveV4BluechipReserve.usdgCore,
      ]) {
        await expect(bluechip().borrow(r, 1n, avatar.address)).toBeAllowed()
        await expect(bluechip().repay(r, 1n, avatar.address)).toBeAllowed()
      }
    })

    it("forbids every other reserve: USDC Prime (4), frxUSD (8), BTC", async () => {
      for (const r of [
        aaveV4BluechipReserve.usdcPrime,
        aaveV4BluechipReserve.frxusdCore,
        aaveV4BluechipReserve.wbtcPrime,
        aaveV4BluechipReserve.cbbtcPrime,
      ]) {
        await expect(bluechip().borrow(r, 1n, avatar.address)).toBeForbidden()
      }
      await expect(
        bluechip().repay(aaveV4BluechipReserve.usdcPrime, 1n, avatar.address)
      ).toBeForbidden()
    })

    it("forbids supplying a stablecoin and borrowing for a third party", async () => {
      await expect(
        bluechip().supply(aaveV4BluechipReserve.usdcCore, 1n, avatar.address)
      ).toBeForbidden()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdgCore, 1n, stranger)
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("forbids position managers and multicall", async () => {
      await expect(
        bluechip().setUserPositionManager(stranger, true)
      ).toBeForbidden()
      await expect(bluechip().multicall([])).toBeForbidden()
    })
  })

  describe("C - Curve USDG/USDC atomic swap", () => {
    it("approves USDC and USDG to the pool", async () => {
      await expect(
        erc20().attach(USDC).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(curvePool, parseUnits("1", 6))
      ).toBeAllowed()
    })

    it("swaps USDG -> USDC (0 -> 1) and USDC -> USDG (1 -> 0)", async () => {
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](0, 1, 1000000n, 0n)
      ).toBeAllowed()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](1, 0, 1000000n, 0n)
      ).toBeAllowed()
    })

    it("forbids other coin indices and the receiver variant", async () => {
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](0, 0, 1n, 0n)
      ).toBeForbidden()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256)"](1, 1, 1n, 0n)
      ).toBeForbidden()
      await expect(
        curve()["exchange(int128,int128,uint256,uint256,address)"](
          1,
          0,
          1n,
          0n,
          avatar.address
        )
      ).toBeForbidden(Status.FunctionNotAllowed)
    })

    it("forbids adding or removing liquidity, other pools and other spenders", async () => {
      await expect(
        curve()["add_liquidity(uint256[],uint256)"]([1n, 1n], 0n)
      ).toBeForbidden(Status.FunctionNotAllowed)
      await expect(
        kit.asMember.curve.rlUsdUsdcPool[
          "exchange(int128,int128,uint256,uint256)"
        ](1, 0, 1n, 0n)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
      await expect(
        erc20().attach(USDG).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDT).approve(curvePool, parseUnits("1", 6))
      ).toBeForbidden()
    })
  })

  describe("D - kpk USDC Yield v2 and kpk USDC Yield RWA", () => {
    const vaults = [morpho.kpkUsdcYieldV2, morpho.kpkUsdcYieldRWA]

    it("approves USDC, deposits and withdraws for the avatar on both vaults", async () => {
      for (const v of vaults) {
        await expect(
          erc20().attach(USDC).approve(v, parseUnits("1", 6))
        ).toBeAllowed()
        await expect(vault(v).deposit(1n, avatar.address)).toBeAllowed()
        await expect(
          vault(v).withdraw(1n, avatar.address, avatar.address)
        ).toBeAllowed()
      }
    })

    it("forbids withdrawing to or depositing for a third party", async () => {
      for (const v of vaults) {
        await expect(
          vault(v).withdraw(1n, stranger, avatar.address)
        ).toBeForbidden()
        await expect(vault(v).deposit(1n, stranger)).toBeForbidden()
      }
    })

    it("force deallocates on both vaults on behalf of the avatar only", async () => {
      for (const v of vaults) {
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, avatar.address)
        ).toBeAllowed()
        await expect(
          vault(v).forceDeallocate(stranger, "0x", 1n, stranger)
        ).toBeForbidden(Status.ParameterNotAllowed)
      }
    })

    it("forbids any other vault", async () => {
      await expect(
        vault(morpho.kpkUsdcPrimeV2).deposit(1n, avatar.address)
      ).toBeForbidden(Status.TargetAddressNotAllowed)
    })
  })

  describe("E - CowSwap USDG <-> USDC", () => {
    it("approves USDC and USDG to the GPv2 vault relayer", async () => {
      await expect(
        erc20().attach(USDC).approve(cowSwap.gpv2VaultRelayer, 1000000n)
      ).toBeAllowed()
      await expect(
        erc20().attach(USDG).approve(cowSwap.gpv2VaultRelayer, 1000000n)
      ).toBeAllowed()
    })

    it("signs sell and buy orders both ways", async () => {
      await expect(cowOrder(USDG, USDC)).toBeAllowed()
      await expect(cowOrder(USDC, USDG)).toBeAllowed()
      await expect(cowOrder(USDC, USDG, "buy")).toBeAllowed()
    })

    it("forbids any other pair", async () => {
      await expect(cowOrder(USDG, WBTC)).toBeForbidden()
      await expect(cowOrder(WBTC, USDC)).toBeForbidden()
      await expect(cowOrder(USDC, USDT)).toBeForbidden()
    })
  })

  describe("F - Aave v3 Core (venue_kind: aave_v3): WBTC collateral, USDC debt", () => {
    it("approves WBTC and USDC to the Pool, and to no one else", async () => {
      await expect(
        erc20().attach(WBTC).approve(poolCoreV3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(poolCoreV3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(WBTC).approve(stranger, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("supplies, enables as collateral and withdraws WBTC for the avatar", async () => {
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeAllowed()
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, true)
      ).toBeAllowed()
      await expect(pool().withdraw(WBTC, 1n, avatar.address)).toBeAllowed()
    })

    it("forbids disabling WBTC as collateral, cbBTC and acting for a third party", async () => {
      await expect(
        pool().setUserUseReserveAsCollateral(WBTC, false)
      ).toBeForbidden(Status.ParameterNotAllowed)
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().supply(WBTC, 1n, stranger, 0)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().withdraw(WBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("borrows and repays USDC for the avatar", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeAllowed()
      await expect(pool().repay(USDC, 1n, 2, avatar.address)).toBeAllowed()
    })

    it("forbids other debt assets, supplying a stablecoin and borrowing or repaying for a third party", async () => {
      await expect(
        pool().borrow(USDT, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(
        pool().borrow(USDG, 1n, 2, 0, avatar.address)
      ).toBeForbidden()
      await expect(pool().supply(USDC, 1n, avatar.address, 0)).toBeForbidden()
      await expect(pool().borrow(USDC, 1n, 2, 0, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(pool().repay(USDC, 1n, 2, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })
  })

  describe("G - Compound v3 Institutional (ciUSDCv3): WBTC collateral, USDC debt", () => {
    it("approves WBTC and USDC to the Comet, and cbBTC not", async () => {
      await expect(
        erc20().attach(WBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(cbBTC).approve(compoundV3.ciUSDCv3, parseUnits("1", 8))
      ).toBeForbidden()
    })

    it("supplies WBTC collateral and repays: supply(WBTC / USDC)", async () => {
      await expect(comet().supply(WBTC, 1n)).toBeAllowed()
      await expect(comet().supply(USDC, parseUnits("1", 6))).toBeAllowed()
    })

    it("withdraws WBTC collateral and borrows: withdraw(WBTC / USDC)", async () => {
      await expect(comet().withdraw(WBTC, 1n)).toBeAllowed()
      await expect(comet().withdraw(USDC, parseUnits("1", 6))).toBeAllowed()
    })

    it("forbids cbBTC", async () => {
      await expect(comet().supply(cbBTC, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().withdraw(cbBTC, 1n)).toBeForbidden(
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
})
