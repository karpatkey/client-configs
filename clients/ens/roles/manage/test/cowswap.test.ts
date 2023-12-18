import {
  formatBytes32String,
  id,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from "ethers/lib/utils";
import { configurePermissions, wrapEth } from "../../../../../test/helpers";
import { testKit } from "../../../../../test/kit";
import { revertToBase } from "../../../../../test/snapshot";
import permissions from "../permissions";
import { contracts } from "../../../../../eth-sdk/config";
import { ENS, WETH, cowswap } from "../../../../../eth-sdk/addresses";
import { getAvatarWallet } from "../../../../../test/accounts";

describe("ENS", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
    await revertToBase();
    await configurePermissions(permissions);

    // acquire 1 WETH for avatar
    await wrapEth(parseEther("1"));
  });

  describe("cowswap", () => {
    it("allows swapping stETH to USDC", async () => {
      await expect(
        testKit.mainnet.weth.call.approve(
          cowswap.GPv2_VAULT_RELAYER,
          parseEther("1"),
        ),
      ).not.toRevert();

      await expect(
        testKit.mainnet.cowswap.order_signer.delegateCall.signOrder(
          {
            sellToken: WETH,
            buyToken: ENS,
            sellAmount: parseEther("1"),
            buyAmount: parseEther("100"),
            feeAmount: parseEther("0.01"), // denominated in sellToken, 1% of 1 WETH
            receiver: getAvatarWallet().address,
            validTo: Math.round(Date.now() / 1000) + 30 * 60, // 30 minutes from now
            kind: id("sell"),
            partiallyFillable: false,
            sellTokenBalance: id("erc20"),
            buyTokenBalance: id("erc20"),
            appData: keccak256(toUtf8Bytes("TEST")),
          },
          30 * 60, // report relative valid duration: 30 minutes
          250, // report fee: 1%
        ),
      ).not.toRevert();
    });
  });
});
