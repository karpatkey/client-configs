import { JsonRpcProvider } from "ethers"
import config from "../eth-sdk/config"

export const providers = {
  [1]: new JsonRpcProvider(config.rpc?.mainnet),
  [10]: new JsonRpcProvider(config.rpc?.optimism),
  [100]: new JsonRpcProvider(config.rpc?.gnosis),
  [8453]: new JsonRpcProvider(config.rpc?.base),
  [42161]: new JsonRpcProvider(config.rpc?.arbitrumOne),
}
