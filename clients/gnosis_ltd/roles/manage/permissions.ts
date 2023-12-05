import { Permission } from "zodiac-roles-sdk";
import { allow } from 'zodiac-roles-sdk/kit';
import { allow as allowAction } from "defi-kit/eth";
import { contracts } from "../../../../eth-sdk/config"
import { DAI } from "../../../../eth-sdk/addresses"
import { avatar } from "../../index"

export default [
  // Use defi-kit to generate the permissions...
  // Lido
  ...allowAction.lido.deposit(),

  // Compound v3
  ...allowAction.compound_v3.deposit({ targets: ["cUSDCv3"] }),

  // Aura - 50COW-50WETH
  ...allowAction.aura.deposit({ targets: ["105"] }),
  // Aura - Lock
  ...allowAction.aura.lock(),


  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Spark - sDAI
  // ...allowErc20Approve([DAI], [contracts.mainnet.spark.sDAI]),
  allow.mainnet.spark.sDAI.deposit(undefined, avatar),
  allow.mainnet.spark.sDAI.redeem(undefined, avatar, avatar),

] satisfies Permission[];