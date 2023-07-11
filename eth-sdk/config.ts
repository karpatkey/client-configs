import { EthSdkConfig, defineConfig } from "@dethcrypto/eth-sdk";

export const contracts = {
  mainnet: {
    balancer: {
      vault: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    },
  },
} satisfies EthSdkConfig["contracts"];

export default defineConfig({
  contracts,
});
