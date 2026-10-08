import { id, keccak256, parseUnits, toUtf8Bytes } from "ethers"
import { applyPermissions } from "@/test/helpers"
import { avatar } from "@/test/wallets"
import kit from "@/test/kit"
import { Status } from "@/test/types"
import { contracts } from "@/contracts"
import { cbBTC, cowSwap, USDC, WBTC } from "@/addresses/eth"
import { aaveV4BluechipReserve } from "../../addresses"
import { parameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// An address that is neither the avatar nor a scoped spender
const stranger = "0x000000000000000000000000000000000000dEaD"

const erc20 = () => kit.asMember.weth

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
})
