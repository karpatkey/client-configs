import { concat, toBeHex, zeroPadValue } from "ethers"
import { applyPermissions } from "@/test/helpers"
import kit from "@/test/kit"
import { contracts } from "@/contracts"
import { GHO, USDC, USDS, USDT } from "@/addresses/eth"
import { parameters as usdAlphaFundParameters } from "../../instances/main_prod"
import allowedCalls from "./permissions/calls"
import allowedActions from "./permissions/_actions"

const avatar = usdAlphaFundParameters.avatar
const avatarBytes32 = "0x" + avatar.slice(2).padStart(64, "0")

/**
 * Builds a minimal CCTP v2 BurnMessage matching only the byte offsets that
 * the `circle_v2.receive` scoping checks (version, domains, sender ==
 * source TokenMessenger, recipient == destination TokenMessenger, burnToken
 * == source chain's USDC, mintRecipient == avatar). Everything else is
 * zero-filled — the role doesn't constrain it, and signature/attestation
 * validity is irrelevant to whether the Roles permission check passes.
 * Byte offsets were verified against the actual compiled condition tree,
 * not derived from the CCTP spec alone.
 */
function buildCctpReceiveMessage({
  sourceDomain,
  destinationDomain,
  sourceTokenMessenger,
  destinationTokenMessenger,
  sourceUsdc,
}: {
  sourceDomain: number
  destinationDomain: number
  sourceTokenMessenger: `0x${string}`
  destinationTokenMessenger: `0x${string}`
  sourceUsdc: `0x${string}`
}) {
  return concat([
    "0x00000001", // version
    toBeHex(sourceDomain, 4),
    toBeHex(destinationDomain, 4),
    zeroPadValue("0x", 32), // nonce (unconstrained)
    zeroPadValue(sourceTokenMessenger, 32), // sender
    zeroPadValue(destinationTokenMessenger, 32), // recipient
    zeroPadValue("0x", 32), // destinationCaller (unconstrained)
    zeroPadValue("0x", 4), // minFinalityThreshold (unconstrained)
    zeroPadValue("0x", 4), // finalityThresholdExecuted (unconstrained)
    zeroPadValue("0x", 4), // message body selector (unconstrained)
    zeroPadValue(sourceUsdc, 32), // burnToken (source chain's USDC)
    zeroPadValue(avatar, 32), // mintRecipient
    zeroPadValue("0x", 32), // unconstrained (message body field)
    zeroPadValue(avatar, 32), // messageSender / recipient (also checked)
  ])
}

describe.skip("usd-alpha-fund mainnet MANAGER - scope reduced to mainnet-only", () => {
  beforeAll(async () => {
    await applyPermissions(
      { allowedActions, allowedCalls },
      usdAlphaFundParameters
    )
  })

  describe("Bridging capital out to L2s is no longer allowed", () => {
    it("Circle v2 - depositForBurn to Arbitrum is forbidden", async () => {
      await expect(
        kit.asMember.circleV2.tokenMessenger.depositForBurn(
          0n,
          3, // Arbitrum domain
          avatarBytes32,
          contracts.mainnet.usdc,
          zeroPadValue("0x", 32),
          0n,
          0
        )
      ).toBeForbidden()
    })

    it("Circle v2 - depositForBurn to Base is forbidden", async () => {
      await expect(
        kit.asMember.circleV2.tokenMessenger.depositForBurn(
          0n,
          6, // Base domain
          avatarBytes32,
          contracts.mainnet.usdc,
          zeroPadValue("0x", 32),
          0n,
          0
        )
      ).toBeForbidden()
    })

    it("Circle v2 - depositForBurn to Optimism is forbidden", async () => {
      await expect(
        kit.asMember.circleV2.tokenMessenger.depositForBurn(
          0n,
          2, // Optimism domain
          avatarBytes32,
          contracts.mainnet.usdc,
          zeroPadValue("0x", 32),
          0n,
          0
        )
      ).toBeForbidden()
    })

    it("CCIP - ccipSend GHO to Gnosis is forbidden", async () => {
      await expect(
        kit.asMember.chainlink.router.ccipSend(
          "465200170687744372", // Gnosis selector
          {
            receiver: avatarBytes32,
            data: "0x",
            tokenAmounts: [{ token: GHO, amount: 0n }],
            feeToken: "0x0000000000000000000000000000000000000000",
            extraArgs: "0x",
          }
        )
      ).toBeForbidden()
    })

    it("CCIP - ccipSend GHO to Arbitrum is forbidden", async () => {
      await expect(
        kit.asMember.chainlink.router.ccipSend(
          "4949039107694359620", // Arbitrum selector
          {
            receiver: avatarBytes32,
            data: "0x",
            tokenAmounts: [{ token: GHO, amount: 0n }],
            feeToken: "0x0000000000000000000000000000000000000000",
            extraArgs: "0x",
          }
        )
      ).toBeForbidden()
    })

    it("CCIP - ccipSend GHO to Base is forbidden", async () => {
      await expect(
        kit.asMember.chainlink.router.ccipSend(
          "15971525489660198786", // Base selector
          {
            receiver: avatarBytes32,
            data: "0x",
            tokenAmounts: [{ token: GHO, amount: 0n }],
            feeToken: "0x0000000000000000000000000000000000000000",
            extraArgs: "0x",
          }
        )
      ).toBeForbidden()
    })

    it("Gnosis Bridge - relayTokens USDS to XDAI is forbidden", async () => {
      await expect(
        kit.asMember.gnosisBridge.xdaiUsdsBridge.relayTokens(USDS, avatar, 0n)
      ).toBeForbidden()
    })

    it("Gnosis Bridge - relayTokensAndCall USDC to USDC.e is forbidden", async () => {
      await expect(
        kit.asMember.gnosisBridge.gnoOmnibridge.relayTokensAndCall(
          USDC,
          contracts.gnosis.gnosisBridge.usdcTransmuter,
          0n,
          avatarBytes32
        )
      ).toBeForbidden()
    })

    it("Stargate - send USDC to Gnosis is forbidden", async () => {
      await expect(
        kit.asMember.stargate.poolUsdc.send(
          {
            dstEid: 30145,
            to: avatarBytes32,
            amountLD: 0n,
            minAmountLD: 0n,
            extraOptions: "0x",
            composeMsg: "0x",
            oftCmd: "0x",
          },
          { nativeFee: 0n, lzTokenFee: 0n },
          avatar
        )
      ).toBeForbidden()
    })

    it("Stargate - send USDC to Arbitrum is forbidden", async () => {
      await expect(
        kit.asMember.stargate.poolUsdc.send(
          {
            dstEid: 30110,
            to: avatarBytes32,
            amountLD: 0n,
            minAmountLD: 0n,
            extraOptions: "0x",
            composeMsg: "0x",
            oftCmd: "0x",
          },
          { nativeFee: 0n, lzTokenFee: 0n },
          avatar
        )
      ).toBeForbidden()
    })

    it("Stargate - send USDT to Optimism is forbidden", async () => {
      await expect(
        kit.asMember.stargate.poolUsdt.send(
          {
            dstEid: 30111,
            to: avatarBytes32,
            amountLD: 0n,
            minAmountLD: 0n,
            extraOptions: "0x",
            composeMsg: "0x",
            oftCmd: "0x",
          },
          { nativeFee: 0n, lzTokenFee: 0n },
          avatar
        )
      ).toBeForbidden()
    })
  })

  describe("Receiving capital back from L2s still works", () => {
    it("Circle v2 - receiveMessage from Arbitrum is allowed", async () => {
      const message = buildCctpReceiveMessage({
        sourceDomain: 3, // Arbitrum
        destinationDomain: 0, // Ethereum
        sourceTokenMessenger: contracts.arbitrumOne.circleV2.tokenMessenger,
        destinationTokenMessenger: contracts.mainnet.circleV2.tokenMessenger,
        sourceUsdc: contracts.arbitrumOne.usdc,
      })
      await expect(
        kit.asMember.circleV2.messageTransmitter.receiveMessage(
          message,
          "0x1234"
        )
      ).toBeAllowed()
    })

    it("Claim bridged XDAI from Gnosis is allowed", async () => {
      // Layout checked by the condition: avatar(20) + amount(32, any) +
      // nonce(32, any) + recipient(20, must equal gnoXdaiBridge)
      const message = concat([
        avatar,
        zeroPadValue("0x", 32),
        zeroPadValue("0x", 32),
        contracts.mainnet.gnosisBridge.gnoXdaiBridge,
      ])
      await expect(
        kit.asMember.gnosisBridge.xdaiUsdsBridge.executeSignatures(
          message,
          "0x1234"
        )
      ).toBeAllowed()
    })

    it("Claim bridged USDC from Gnosis is allowed", async () => {
      // Layout checked by the condition: messageId prefix(32) +
      // sender=xdaiBridge(20) + executor=gnoOmnibridge(20) + gasLimit(4) +
      // dataType/chainIds(5) + selector(4) + token=USDC(20, 32-byte slot) +
      // avatar(20, 32-byte slot)
      const message = concat([
        "0x00050000a7823d6f1e31569f51861e345b30c6bebf70ebe7",
        zeroPadValue("0x", 8), // nonce (unconstrained)
        contracts.gnosis.gnosisBridge.xdaiBridge,
        contracts.mainnet.gnosisBridge.gnoOmnibridge,
        "0x000927c00101806401272255bb",
        zeroPadValue(USDC, 32),
        zeroPadValue(avatar, 32),
      ])
      await expect(
        kit.asMember.gnosisBridge.xdaiUsdsBridge.safeExecuteSignaturesWithAutoGasLimit(
          message,
          "0x1234"
        )
      ).toBeAllowed()
    })
  })
})
