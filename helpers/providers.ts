import { JsonRpcProvider } from "ethers"
import config from "../eth-sdk/config"

// Pass chainId + staticNetwork:true so constructing the provider does not
// start an eager _detectNetwork() retry loop. Without this, an unreachable
// RPC URL (e.g. in CI) keeps retrying in the background and leaks past the
// end of the test run.
const opts = { staticNetwork: true } as const

export const providers = {
  [1]: new JsonRpcProvider(config.rpc?.mainnet, 1, opts),
  [10]: new JsonRpcProvider(config.rpc?.optimism, 10, opts),
  [100]: new JsonRpcProvider(config.rpc?.gnosis, 100, opts),
  [8453]: new JsonRpcProvider(config.rpc?.base, 8453, opts),
  [42161]: new JsonRpcProvider(config.rpc?.arbitrumOne, 42161, opts),
}
