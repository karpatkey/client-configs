import { EthSdkConfig, defineConfig } from "@gnosis-guild/eth-sdk"
import { contracts as deFiKitContracts } from "defi-kit"

export const contracts = {
  mainnet: {
    ...deFiKitContracts.mainnet,
    navCalculator: "0xF0125A04d74782e6d2aD6d298F0Bc786e301AAc1",
    curve: {
      ...deFiKitContracts.mainnet.curve,
      ethxfPool: "0x59Ab5a5b5d617E478a2479B0cAD80DA7e2831492",
      ethxfGauge: "0x7671299eA7B4bbE4f3fD305A994e6443b4be680E",
      ankrCrvPool: "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2",
      ankrCrvGauge: "0x6d10ed2cF043E6fcf51A0e7b4C2Af3Fa06695707",
    },
    etherfi: {
      liquidEth: "0xf0bb20865277aBd641a307eCe5Ee04E79073416C",
      tellerWithMultiAssetSupport: "0x5c135e8eC99557b412b9B4492510dCfBD36066F5",
      atomicQueue: "0xD45884B592E316eB816199615A95C182F75dea07",
    },
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
