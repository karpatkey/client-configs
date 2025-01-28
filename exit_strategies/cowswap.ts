// import { PermissionSet } from "zodiac-roles-sdk"
// import { allow as allowActionEth } from "defi-kit/eth"
// import { allow as allowActionGno } from "defi-kit/gno"
// import { allow as allowActionArb } from "defi-kit/arb1"
// import { eAddress } from "@/addresses"
// import { Chain } from "@/types"
// import { Address } from "@gnosis-guild/eth-sdk"

// const replaceAddress = (
//   arr: Address[],
//   chain: Chain
// ): (Address | "ETH" | "XDAI")[] => {
//   if (chain === Chain.gno) {
//     return arr.map((addr) => (addr === eAddress ? "XDAI" : addr))
//   } else {
//     return arr.map((addr) => (addr === eAddress ? "ETH" : addr))
//   }
// }

// export const cowswapSwap = async (
//   sell: Address[],
//   buy: Address[],
//   chain: Chain,
//   feeAmountBp?: number | undefined
// ): Promise<PermissionSet> => {
//   const modifiedSell = replaceAddress(sell, chain)
//   const modifiedBuy = replaceAddress(buy, chain)

//   switch (chain) {
//     case Chain.eth:
//       return await allowActionEth.cowswap.swap({
//         sell: modifiedSell as (Address | "ETH")[],
//         buy: modifiedBuy as (Address | "ETH")[],
//         feeAmountBp: feeAmountBp,
//       })

//     case Chain.gno:
//       return await allowActionGno.cowswap.swap({
//         sell: modifiedSell as (Address | "XDAI")[],
//         buy: modifiedBuy as (Address | "XDAI")[],
//         feeAmountBp: feeAmountBp,
//       })

//     case Chain.arb1:
//       return await allowActionArb.cowswap.swap({
//         sell: modifiedSell as (Address | "ETH")[],
//         buy: modifiedBuy as (Address | "ETH")[],
//         feeAmountBp: feeAmountBp,
//       })

//     default:
//       throw new Error(`Unsupported chain: ${chain}`)
//   }
// }
