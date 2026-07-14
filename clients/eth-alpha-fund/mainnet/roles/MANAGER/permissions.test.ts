import { parseEther, ZeroAddress } from "ethers"
import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import { avatar } from "@/test/wallets"
import { stakeWiseV3 } from "@/addresses/eth"
import { parameters as ethAlphaParameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

// The (unnamed) EthMetaVault the fund holds a StakeWise position in.
const ETH_META_VAULT = stakeWiseV3.ethMetaVault
// A different StakeWise vault, used to prove the assistant's vault-arg scoping.
const OTHER_VAULT = stakeWiseV3.genesis

describe("eth-alpha-fund MANAGER — onchain-accounting assisted exits", () => {
  beforeAll(async () => {
    await applyPermissions({ allowedActions, allowedCalls }, ethAlphaParameters)
  })

  describe("ether.fi", () => {
    it("allows requestWithdraw through the assistant (delegatecall)", async () => {
      await expect(
        kit.asMember.etherfi.assistant.requestWithdraw.delegateCall(
          parseEther("1")
        )
      ).toBeAllowed()
    })

    it("allows claimWithdraw through the assistant (delegatecall)", async () => {
      await expect(
        kit.asMember.etherfi.assistant.claimWithdraw.delegateCall(1)
      ).toBeAllowed()
    })

    it("forbids requestWithdraw called directly on the liquidity pool", async () => {
      await expect(
        kit.asMember.etherfi.liquidityPool.requestWithdraw(
          avatar.address,
          parseEther("1")
        )
      ).toBeForbidden()
    })

    it("forbids claimWithdraw called directly on the withdraw-request NFT", async () => {
      await expect(
        kit.asMember.etherfi.withdrawRequestNft.claimWithdraw(1)
      ).toBeForbidden()
    })

    it("forbids the assistant as a normal call (must be delegatecall)", async () => {
      await expect(
        kit.asMember.etherfi.assistant.requestWithdraw(parseEther("1"))
      ).toBeForbidden()
    })

    it("still allows staking ETH for eETH directly", async () => {
      await expect(
        kit.asMember.etherfi.liquidityPool["deposit()"]()
      ).toBeAllowed()
    })
  })

  describe("StakeWise v3", () => {
    it("allows enterExitQueue through the assistant (delegatecall)", async () => {
      await expect(
        kit.asMember.stakeWiseV3.assistant.enterExitQueue.delegateCall(
          ETH_META_VAULT,
          parseEther("1")
        )
      ).toBeAllowed()
    })

    it("allows claimExitedAssets through the assistant (delegatecall)", async () => {
      await expect(
        kit.asMember.stakeWiseV3.assistant.claimExitedAssets.delegateCall(
          ETH_META_VAULT,
          1,
          1,
          0
        )
      ).toBeAllowed()
    })

    it("forbids exiting a vault other than the scoped one via the assistant", async () => {
      await expect(
        kit.asMember.stakeWiseV3.assistant.enterExitQueue.delegateCall(
          OTHER_VAULT,
          parseEther("1")
        )
      ).toBeForbidden()
    })

    it("forbids enterExitQueue called directly on the vault", async () => {
      await expect(
        kit.asMember.stakeWiseV3.vault
          .attach(ETH_META_VAULT)
          .enterExitQueue(parseEther("1"), avatar.address)
      ).toBeForbidden()
    })

    it("forbids claimExitedAssets called directly on the vault", async () => {
      await expect(
        kit.asMember.stakeWiseV3.vault
          .attach(ETH_META_VAULT)
          .claimExitedAssets(1, 1, 0)
      ).toBeForbidden()
    })

    it("still allows depositing ETH directly to the vault", async () => {
      await expect(
        kit.asMember.stakeWiseV3.vault
          .attach(ETH_META_VAULT)
          .deposit(avatar.address, ZeroAddress)
      ).toBeAllowed()
    })

    it("still allows minting osToken directly", async () => {
      await expect(
        kit.asMember.stakeWiseV3.vault
          .attach(ETH_META_VAULT)
          .mintOsToken(avatar.address, parseEther("1"), ZeroAddress)
      ).toBeAllowed()
    })
  })
})
