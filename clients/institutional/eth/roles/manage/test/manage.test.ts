import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "../permissions"
import { testKit } from "../../../../../../test/kit"
import { contracts } from "../../../../../../eth-sdk/config"
import { parseUnits } from "ethers/lib/utils"
import { USDC } from "../../../../../../eth-sdk/addresses"
import { avatar as institutional_avatar } from "../../../index"

describe("Institutional", () => {
  beforeAll(async () => {
    // fresh role with Institutional manage permissions
    await revertToBase()
    await applyPermissions(permissions)
  })

  describe("Bridge USDC to Optimism", () => {
    it("depositForBurn", async () => {
      await stealErc20(
        USDC,
        parseUnits("1000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        testKit.eth.weth
          .attach(USDC)
          .approve(
            contracts.mainnet.circle_token_messenger,
            parseUnits("1000", 6)
          )
      ).not.toRevert()
      await expect(
        testKit.eth.circle_token_messenger.depositForBurn(
          parseUnits("1000", 6),
          2,
          "0x" + institutional_avatar.slice(2).padStart(64, "0"),
          USDC
        )
      ).not.toRevert()
    })

    it("receiveMessage", async () => {
      const message =
        "0x0000000000000002000000000000000000029d880000000000000000000000002b4069517957735be00cee0fadae88a26365528f000000000000000000000000bd3fa81b58ba92a82136038b25adec7066af31550000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000" +
        institutional_avatar.slice(2) +
        "00000000000000000000000000000000000000000000000000000000004c4b40000000000000000000000000" +
        institutional_avatar.slice(2)
      await expect(
        testKit.eth.circle_message_transmitter.receiveMessage(
          message,
          "0xf0135945530c1c08835160fc6a2ece40b3f3dfd79b77bd92a313ad70b2ebc0b3010cdc93987535a52db56b2a5740e753031f9572a2b4865e6eb87b8fc1d1322f1c54611ed629fd3cceda39d958a3538f3d2f81384156bc4b037277ede1b0a1c2ca3a96a00e9f6f03bb6ddb71c7b9c5cf0a826264b033a3c83d0fda0ab7842a0b5b1b"
        )
      ).toBeAllowed()
    })
  })

  describe("Bridged USDC from Gnosis Chain", () => {
    it("safeExecuteSignaturesWithAutoGasLimit", async () => {
      const message =
        "0x00050000a7823d6f1e31569f51861e345b30c6bebf70ebe70000000000015a2cf6a78083ca3e2a662d6dd1703c939c8ace2e268d88ad09518695c6c3712ac10a214be5109a655671000927c00101806401272255bb000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000" +
        institutional_avatar.slice(2) +
        "00000000000000000000000000000000000000000000000000000000004c4c10"
      console.log("Message: ", message)
      await expect(
        testKit.eth.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
          message,
          "0x041c1b1c1bc97b6bf0d0aa9747b3d67a41d9b44d59bc88786a53d556ebdb41925c28c31be06811b13a90d7425217e81f0308782cec9f1f8a53efea1f6119528e63d431610c5427863194fe1b17ca43f8cf31fcf4b384eac8ecd40cc038f6e0e3e82df983a9d1d918647ab97eaa6d0907f849da2b439ee25cea79d084cf31fc2e960f4e71693e0bef8383abe60ffee4e8324da1cdea9e854fd968c9dee7a9d4356df1cfc1ba3baa1b0f765a888b33bc5e54f3329ed19b69295ce94a9a1ef83968a2311ccc3769f72a6502187f5c9ed76a6d249db9ea7e173abf2745559a938ffeb3174d61d1260b4060e4b8523552498c4efe75ff5acc88b3f73baa692ae899f119ed6951d6"
        )
      ).toBeAllowed()
    })
  })

  // describe("Bridged COMP from Gnosis Chain", () => {
  //   it("safeExecuteSignaturesWithAutoGasLimit", async () => {
  //     const message =
  //       "0x00050000a7823d6f1e31569f51861e345b30c6bebf70ebe70000000000015a2ff6a78083ca3e2a662d6dd1703c939c8ace2e268d88ad09518695c6c3712ac10a214be5109a655671000927c00101806401272255bb000000000000000000000000c00e94cb662c3520282e6f5717214004a7f26888000000000000000000000000" +
  //       institutional_avatar.slice(2) +
  //       "00000000000000000000000000000000000000000000000002c68af0bb140000"
  //     console.log("Message: ", message)
  //     await expect(
  //       testKit.eth.amb_eth_xdai.safeExecuteSignaturesWithAutoGasLimit(
  //         message,
  //         "0x041b1b1b1cd2f2bcb53d40e9678b95ef5b7af8c509fd6a82acb1600e2fe5911e136be8a946854c4e98356eb5525a49031d1f65a7fe0fdd8cddaf59ca389e0d94f0c8ff0fbc880f4dfb89a4ce40207b3c7bac1e046faf980957e628665608e0c04fe2356ad26dc93d39153a290a28fddfaffa09d57a036da2b4a6a5914d2ec86c3f080cba2b69050db0d2db9090c504f30af4e723899af996112023d9e16c7d2969a8c99a7241ffc3a7e531b81c36b57c196d2b5b05b63c06a07efad203cca363ee3539995452e93a42480b5001395cf4d784312c1e2aef3aed5c3c6f7cd08ae22fa5ae2ba87f7d4170cc8ab2927a9b4ac2de8a53206a29a20eaf24ea93e5621644bf200209"
  //       )
  //     ).toBeAllowed()
  //   })
  // })

  describe("Claim bridged DAI from Gnosis Chain", () => {
    it("executeSignatures", async () => {
      const message =
        "0x" +
        institutional_avatar.slice(2) +
        "0000000000000000000000000000000000000000000000008ac7230489e80000d8bfcc0594814b4f3a61288b8aa56820354bcd4ae898085a8c10dd0d11e1c0e04aa42145aa6ebf72e164c9bbc74fbd3788045016"
      console.log("Message: ", message)
      await expect(
        testKit.eth.gno_xdai_bridge.executeSignatures(
          message,
          "0x041c1b1c1b1626e3796b01f4a2bed572344f3bc4737bc5e2ae2a65a24266fe9381718d1627bed8e7c4719afdd7d5ae3a1b40d8449b8092eb243ef937f4f17dab180e0f1bf657c189c163ac81260b1815161f3d004619c1aeb8459f05727a80c650d1d34cd5c8c5e32e6e3851f23ba8af632d698fdd3e2381f72b92141561cec4b137d950121da5e302daf6b185f9eb9d8fdb8e5865455e022f31990fe734d5ed5c0b054b1a3007cab99dc6e2e0c9c6e12bcac87814beeb0a3decb8073d9b9ec03a41a342bc2b600b8e7ee40131c49d9f0120f60d11837f510c6d9a4f95a709962074d15d592158361b5d63d39244f131450c0c26d9f34066d89ea980fd497a63ce84b68116"
        )
      ).toBeAllowed()
    })
  })
})
