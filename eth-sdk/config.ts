import { EthSdkConfig, defineConfig } from "@gnosis-guild/eth-sdk"
import { contracts as deFiKitContracts } from "defi-kit"

export const contracts = {
  mainnet: {
    ...deFiKitContracts.mainnet,
    navCalculator: "0xF0125A04d74782e6d2aD6d298F0Bc786e301AAc1",
  },
  gnosis: {
    ...deFiKitContracts.gnosis,
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  optimism: {
    ...deFiKitContracts.optimism,
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  arbitrumOne: {
    ...deFiKitContracts.arbitrumOne,
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  base: {
    ...deFiKitContracts.base,
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
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
