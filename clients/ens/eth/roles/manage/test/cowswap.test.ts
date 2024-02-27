import { id, keccak256, parseEther, toUtf8Bytes } from "ethers/lib/utils"
import { applyPermissions, wrapEth } from "../../../../../../test/helpers"

import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "../permissions"
import { ENS, WETH, cowswap } from "../../../../../../eth-sdk/addresses"
import { avatar } from "../../../../../../test/wallets"
import { testKit } from "../../../../../../test/kit"

describe("ENS", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
    await revertToBase()
    await applyPermissions(permissions)

    // acquire 1 WETH for avatar
    await wrapEth(parseEther("1"))
  })

  describe("cowswap", () => {
    it("allows swapping stETH to USDC", async () => {
      await expect(
        testKit.eth.weth.approve(cowswap.GPv2_VAULT_RELAYER, parseEther("1"))
      ).not.toRevert()

      await expect(
        testKit.eth.cowswap.order_signer.delegateCall.signOrder(
          {
            sellToken: WETH,
            buyToken: ENS,
            sellAmount: parseEther("1"),
            buyAmount: parseEther("100"),
            feeAmount: parseEther("0.01"), // denominated in sellToken, 1% of 1 WETH
            receiver: avatar._address,
            validTo: Math.round(Date.now() / 1000) + 30 * 60, // 30 minutes from now
            kind: id("sell"),
            partiallyFillable: false,
            sellTokenBalance: id("erc20"),
            buyTokenBalance: id("erc20"),
            appData: keccak256(toUtf8Bytes("TEST")),
          },
          30 * 60, // report relative valid duration: 30 minutes
          250 // report fee: 1%
        )
      ).not.toRevert()
    })
  })
})
