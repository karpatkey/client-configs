import { c, Permission } from "zodiac-roles-sdk";
import { allow } from "zodiac-roles-sdk/kit";
import { allow as allowAction } from "defi-kit/eth";
import {
  AAVE,
  DAI,
  rETH2,
  sETH2,
  SWISE,
  USDC,
  WBTC,
  WETH,
  ZERO_ADDRESS,
} from "../../../../eth-sdk/addresses";
import { contracts } from "../../../../eth-sdk/config";
import { allowErc20Approve } from "../../../../utils/erc20";
import { avatar } from "../../index";

// governance.karpatkey.eth
const GOVERNANCE_KPK = "0x8787FC2De4De95c53e5E3a4e5459247D9773ea52"

export default [
  // Use defi-kit to generate the permissions...
  // Lido
  ...allowAction.lido.deposit(),

  // Aave v2 - Staking of AAVE in Safety Module
  ...allowAction.aave_v2.stake({ targets: ["AAVE"] }),

  // Compound v3 - cUSDCv3 - USDC
  ...allowAction.compound_v3.deposit({
    targets: ["cUSDCv3"],
    tokens: ["USDC"],
  }),

  // ... or address the contracts eth-sdk/config.ts via the zodiac-roles-sdk/kit
  // Aave - Delegate Aave and stkAave to governance.karpatkey.eth
  allow.mainnet.aave_v2.aave.delegate(GOVERNANCE_KPK),
  allow.mainnet.aave_v2.stkAave.delegate(GOVERNANCE_KPK),

  // Aave v3 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(DAI, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(DAI, undefined, avatar),

  // Aave v3 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.aave_v3.pool_v3]),
  allow.mainnet.aave_v3.pool_v3.supply(USDC, undefined, avatar),
  allow.mainnet.aave_v3.pool_v3.withdraw(USDC, undefined, avatar),

  // Compound v2 - USDC
  ...allowErc20Approve([USDC], [contracts.mainnet.compound_v2.cUSDC]),
  allow.mainnet.compound_v2.cUSDC.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cUSDC.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cUSDC.redeemUnderlying(),

  // Compound v2 - DAI
  ...allowErc20Approve([DAI], [contracts.mainnet.compound_v2.cDAI]),
  allow.mainnet.compound_v2.cDAI.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cDAI.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cDAI.redeemUnderlying(),

  // Compound v2 - AAVE
  ...allowErc20Approve([AAVE], [contracts.mainnet.compound_v2.cAAVE]),
  allow.mainnet.compound_v2.cAAVE.mint(),
  // Withdraw: it is called when MAX underlying amount is withdrawn
  allow.mainnet.compound_v2.cAAVE.redeem(),
  // Withdraw: it is called when MAX underlying amount is NOT withdrawn
  allow.mainnet.compound_v2.cAAVE.redeemUnderlying(),

  // Compound v2 - Claim COMP
  allow.mainnet.compound_v2.comptroller["claimComp(address,address[])"](
    avatar,
    c.subset([
      contracts.mainnet.compound_v2.cAAVE,
      contracts.mainnet.compound_v2.cDAI,
      contracts.mainnet.compound_v2.cUSDC,
    ]),
  ),

  // Uniswap v3 - WBTC + WETH, Range: 11.786 - 15.082. Fee: 0.3%.
  ...allowErc20Approve(
    [WBTC, WETH], 
    [contracts.mainnet.uniswapv3.positions_nft]
  ),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint(
    {
      token0: WBTC,
      token1: WETH,
      fee: 3000,
      recipient: avatar
    }
  ),
  // Mint NFT using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.mint(
          {
            token0: WBTC,
            token1: WETH,
            fee: 3000,
            recipient: avatar
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
          {
            tokenId: 430246
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // Remove liquidity using WETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            recipient: avatar
          }
        ),
      ),
    ]),
    { send: true },
  ),
  // Remove liquidity using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.decreaseLiquidity(),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            tokenId: ZERO_ADDRESS
          }
        ),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          WBTC,
          undefined,
          avatar,
        ),
      ),
    ]),
    { send: true },
  ),
  // Collect fees using WETH
  allow.mainnet.uniswapv3.positions_nft.collect(
    {
      recipient: avatar
    }
  ),
  // Collect fees using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.collect(
          {
            recipient: ZERO_ADDRESS
          }
        ),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.unwrapWETH9(undefined, avatar),
      ),
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.sweepToken(
          WBTC,
          undefined,
          avatar,
        ),
      ),
    ]),
    { send: true },
  ),

  // Stakewise
  // The stake() was added manually to the abi (source: 0x61975c09207c5DFe794b0A652C8CAf8458159AAe)
  allow.mainnet.stakewise.eth2_staking.stake({
    send: true,
  }),
  allow.mainnet.stakewise.merkle_distributor["claim"](
    undefined,
    avatar,
    c.subset([rETH2, SWISE])
  ),
  
  // Stakewise - Uniswap v3 ETH + sETH2, 0.3% - WETH already approved
  ...allowErc20Approve(
    [sETH2],
    [contracts.mainnet.uniswapv3.positions_nft],
  ),
  // Mint NFT using WETH
  allow.mainnet.uniswapv3.positions_nft.mint(
    {
      token0: WETH,
      token1: sETH2,
      fee: 3000,
      recipient: avatar
    }
  ),
  // Mint NFT using ETH
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.mint(
          {
            token0: WETH,
            token1: sETH2,
            fee: 3000,
            recipient: avatar
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // Add liquidity using ETH (WETH is nor permitted through the UI)
  allow.mainnet.uniswapv3.positions_nft.multicall(
    c.matches([
      c.calldataMatches(
        allow.mainnet.uniswapv3.positions_nft.increaseLiquidity(
          {
            tokenId: 418686
          }
        ),
      ),
      c.calldataMatches(allow.mainnet.uniswapv3.positions_nft.refundETH()),
    ]),
    { send: true },
  ),
  // The decreaseLiquidity and collect functions have already been whitelisted.
  
] satisfies Permission[];