import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { getMemberWallet } from "../../../../../test/accounts"

const sdk = getMainnetSdk(getMemberWallet())
describe("ENS", function(){
  describe("cowswap", function(){
    it("should allow swapping stETH to USDC", async function(){
      sdk.cowswap.order_signer.signOrder
    })
  }) 
}) 