import {
  getMainnetSdk,
  getOptimismSdk,
  getGnosisSdk,
  getBaseSdk,
  getArbitrumOneSdk,
  getXlayerSdk,
} from "@gnosis-guild/eth-sdk-client"
import { providers } from "./providers"

export const sdks = {
  [1]: getMainnetSdk(providers[1]),
  [10]: getOptimismSdk(providers[10]),
  [100]: getGnosisSdk(providers[100]),
  [196]: getXlayerSdk(providers[196]),
  [8453]: getBaseSdk(providers[8453]),
  [42161]: getArbitrumOneSdk(providers[42161]),
}
