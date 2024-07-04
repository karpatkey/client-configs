import { applyPermissions, stealErc20 } from "../../../../../../test/helpers"
import { revertToBase } from "../../../../../../test/snapshot"
import permissions from "../permissions"
import { avatar } from "../../../../../../test/wallets"
import { testKit } from "../../../../../../test/kit"
import { contracts } from "../../../../../../eth-sdk/config"
import { parseEther, parseUnits } from "ethers/lib/utils"
import { USDC } from "../../../../../../eth-sdk/addresses"
import { avatar as crypto_avatar } from "../../../index"

describe("Crypto", () => {
  beforeAll(async () => {
    // fresh role with ENS manage permissions
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
          "0x" + crypto_avatar.slice(2).padStart(64, "0"),
          USDC
        )
      ).not.toRevert()
    })
  })

  it("receiveMessage", async () => {
    const message =
      "0x0000000000000002000000000000000000029d880000000000000000000000002b4069517957735be00cee0fadae88a26365528f000000000000000000000000bd3fa81b58ba92a82136038b25adec7066af31550000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000" +
      crypto_avatar.slice(2) +
      "00000000000000000000000000000000000000000000000000000000004c4b40000000000000000000000000" +
      crypto_avatar.slice(2)
    await expect(
      testKit.eth.circle_message_transmitter.receiveMessage(
        message,
        "0xf0135945530c1c08835160fc6a2ece40b3f3dfd79b77bd92a313ad70b2ebc0b3010cdc93987535a52db56b2a5740e753031f9572a2b4865e6eb87b8fc1d1322f1c54611ed629fd3cceda39d958a3538f3d2f81384156bc4b037277ede1b0a1c2ca3a96a00e9f6f03bb6ddb71c7b9c5cf0a826264b033a3c83d0fda0ab7842a0b5b1b"
      )
    ).toBeAllowed()
  })
})
