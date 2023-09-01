import { Permission } from "zodiac-roles-sdk";
import { allow } from 'zodiac-roles-sdk/kit';
import { allow as allowAction } from "defi-kit/eth";

export default [
  // Use defi-kit to generate the permissions...
  ...allowAction.lido.deposit(),
  ...allowAction.compound_v2.deposit({ targets: ["USDC", "DAI"] }),
  ...allowAction.compound_v3.deposit({ targets: ["cUSDCv3"] }),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  allow.mainnet.balancer.vault.flashLoan() // TODO only here as an example, remove this 

  // TODO add all the other permissions (using defi-kit as much as possible)
] satisfies Permission[];
