import { parseUnits } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, compoundV3, USDC, USDG, USDT, WBTC, WETH } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/sub_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const curvePool = contracts.mainnet.curve.usdgUsdcPool
const poolCoreV3 = contracts.mainnet.aaveV3.poolCoreV3
const curve = () => kit.asMember.curve.usdgUsdcPool
const erc20 = () => kit.asMember.weth
const comet = () => kit.asMember.compoundV3.comet.attach(compoundV3.ciUSDCv3)
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
      await expect(pool().withdraw(USDT, 1n, avatar.address)).toBeForbidden()
    })

    it("withdraws cbBTC to the avatar only", async () => {
      await expect(pool().withdraw(cbBTC, 1n, avatar.address)).toBeAllowed()
      await expect(pool().withdraw(cbBTC, 1n, stranger)).toBeForbidden(
        Status.ParameterNotAllowed
      )
    })

    it("never borrows or supplies", async () => {
      await expect(pool().borrow(USDC, 1n, 2, 0, avatar.address)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().supply(WBTC, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(pool().supply(cbBTC, 1n, avatar.address, 0)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Compound v3 Institutional (ciUSDCv3): loan_position_exit unwind", () => {
    it("approves USDC to the Comet, not to a stranger", async () => {
      await expect(
        erc20().attach(USDC).approve(compoundV3.ciUSDCv3, parseUnits("1", 6))
      ).toBeAllowed()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
    })

    it("repays USDC (supply)", async () => {
      await expect(comet().supply(USDC, parseUnits("1", 6))).toBeAllowed()
    })

    it("withdraws WBTC and cbBTC collateral", async () => {
      await expect(comet().withdraw(WBTC, 1n)).toBeAllowed()
      await expect(comet().withdraw(cbBTC, 1n)).toBeAllowed()
    })

    it("cannot borrow, add collateral, use other assets or the To / allow variants", async () => {
      await expect(comet().withdraw(USDC, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().supply(WBTC, 1n)).toBeForbidden(
        Status.ParameterNotAllowed
      )
      await expect(comet().withdraw(WETH, 1n)).toBeForbidden(Status.OrViolation)
      await expect(comet().withdrawTo(stranger, WBTC, 1n)).toBeForbidden(
        Status.FunctionNotAllowed
      )
      await expect(comet().allow(stranger, true)).toBeForbidden(
        Status.FunctionNotAllowed
      )
    })
  })

  describe("Curve USDG/USDC atomic swap", () => {
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

    it("forbids other coin indices, the receiver variant and other spenders", async () => {
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
      await expect(
        erc20().attach(USDT).approve(curvePool, parseUnits("1", 6))
      ).toBeForbidden()
      await expect(
        erc20().attach(USDC).approve(stranger, parseUnits("1", 6))
      ).toBeForbidden()
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

    it("still repays USDG (11) for the avatar, and never borrows", async () => {
      const bluechip = () => kit.asMember.aaveV4.bluechipSpoke
      await expect(
        bluechip().repay(aaveV4BluechipReserve.usdgCore, 1n, avatar.address)
      ).toBeAllowed()
      await expect(
        bluechip().borrow(aaveV4BluechipReserve.usdgCore, 1n, avatar.address)
      ).toBeForbidden()
    })
  })
})
