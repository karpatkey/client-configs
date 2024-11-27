import { EthSdkConfig, defineConfig } from "@gnosis-guild/eth-sdk"
import { contracts as deFiKitContracts } from "defi-kit"

export const contracts = {
  mainnet: {
    ...deFiKitContracts.mainnet,
  },
  gnosis: {
    ...deFiKitContracts.gnosis,
  },
  optimism: {
    ...deFiKitContracts.optimism,
  },
  arbitrumOne: {
    ...deFiKitContracts.arbitrumOne,
  },
  base: {
    ...deFiKitContracts.base,
  },
} satisfies EthSdkConfig["contracts"]

export default defineConfig({
  rpc: {
    mainnet: "https://rpc.ankr.com/eth",
    gnosis: "https://rpc.gnosischain.com/",
    //gnosis: "https://rpc.ankr.com/gnosis"
    optimism: "https://rpc.ankr.com/optimism",
    arbitrumOne: "https://arb1.arbitrum.io/rpc",
    base: "https://base-rpc.publicnode.com",
  },
  contracts,
})
