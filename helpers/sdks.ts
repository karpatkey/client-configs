import {
  getMainnetSdk,
  getOptimismSdk,
  getGnosisSdk,
  getBaseSdk,
  getArbitrumOneSdk,
} from "@dethcrypto/eth-sdk-client"
import config from "../eth-sdk/config"
import { JsonRpcProvider } from "@ethersproject/providers"

export const sdks = {
  [1]: getMainnetSdk(new JsonRpcProvider(config.rpc?.mainnet)),
  [10]: getOptimismSdk(new JsonRpcProvider(config.rpc?.optimism)),
  [100]: getGnosisSdk(new JsonRpcProvider(config.rpc?.gnosis)),
  [8453]: getBaseSdk(new JsonRpcProvider(config.rpc?.base)),
  [42161]: getArbitrumOneSdk(new JsonRpcProvider(config.rpc?.arbitrumOne)),
}
