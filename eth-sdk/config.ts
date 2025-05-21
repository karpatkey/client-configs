import { defineConfig } from "@gnosis-guild/eth-sdk"
import { contracts as deFiKitContracts } from "defi-kit"

export const contracts = {
  mainnet: {
    ...deFiKitContracts.mainnet,
    acrossV2: {
      hubPoolV2: "0xc186fA914353c44b2E33eBE05f21846F1048bEda",
    },
    angle: {
      wstEthEurVault: "0x73aaf8694BA137a7537E7EF544fcf5E2475f227B",
    },
    autonolas: {
      veOlas: "0x7e01A500805f8A52Fad229b3015AD130A332B7b3",
    },
    azuro: {
      stAzur: "0x67f3228fD58f5A26D93a5dd0c6989b69c95618eB",
      vesting: "0xDd180c6387468E1Cb3D4a592016E8Fe0ae8Cc35f",
    },
    balancerV2: {
      ...deFiKitContracts.mainnet.balancerV2,
      bCow50Cow50Wsteth: "0x9bd702E05B9c97E4A4a3E47Df1e0fe7A0C26d2F1",
      bCow50Weth50Usdc: "0xf08D4dEa369C456d26a3168ff0024B904F2d8b91",
      bCow50Weth50UsdcGauge: "0xF9423B78D784D610A00955E733dBa0bf9bda7B06",
      bCow50Wnxm50Weth: "0x7c838b3Ed3C15a5d5032e809B8714f0aE5e9A821",
      bCow50Safe50Weth: "0xbF8868b754A77E90Ea68ffC0b5B10A7c729457E1",
    },
    balancerV3: {
      compositeLiquidityRouter: "0xb21A277466e7dB6934556a1Ce12eb3F032815c8A",
      aaveLidoWethWstEth: "0xc4Ce391d82D164c166dF9c8336DDF84206b2F812",
      aaveLidoWethWstEthGauge: "0x4B891340b51889f438a03DC0e8aAAFB0Bc89e7A6",
      ethxWaWeth: "0x4AB7aB316D43345009B2140e0580B072eEc7DF16",
      ethxWaWethGauge: "0x1f3A4C8115629C33A28bF2F97F22D31d256317F6",
      osEthWaWeth: "0x57c23c58B1D8C3292c15BEcF07c62C5c52457A42",
      osEthWaWethGauge: "0x70A1c01902DAb7a45dcA1098Ca76A8314dd8aDbA",
    },
    curve: {
      ...deFiKitContracts.mainnet.curve,
      steCrvPool: "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
      steCrvPoolGauge: "0x182B723a58739a9c974cFDB385ceaDb237453c28",
      osEthRethPool: "0xe080027Bd47353b5D1639772b4a75E9Ed3658A0d",
      osEthRethGauge: "0x63037a4e3305d25D48BAED2022b8462b2807351c",
      cDaicUsdcPool: "0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56",
      cDaicUsdcGauge: "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575",
      cDaicUsdcZap: "0xeB21209ae4C2c9FF2a86ACA31E123764A3B6Bc06",
      x3CrvPool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
      x3CrvGauge: "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A",
      cvxEthPool: "0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4",
      ankrEthPool: "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2",
      stEthNgfPool: "0x21E27a5E5513D6e65C4f830167390997aA84843a",
      stEthNgfGauge: "0x79F21BC30632cd40d2aF8134B469a0EB4C9574AA",
      ghoBtcWstePool: "0x8Cd52ee292313C4D851e71A7064F096504aB3eE9",
      ghoBtcWsteGauge: "0x6373E119F2A1Fd081249BC16FE7FEA1F6b3A4Ca8",
      oEthCrvPool: "0x94B17476A93b3262d87B9a326965D1E91f9c13E7",
      oEthCrvGauge: "0xd03BE91b1932715709e18021734fcB91BB431715",
      crvUsdtWbtcWethPool: "0xf5f5B97624542D72A9E06f04804Bf81baA15e2B4",
      crvUsdtWbtcWethGauge: "0xF29FfF074f5cF755b55FbB3eb10A29203ac91EA2",
      crvUsdUsdtPool: "0x390f3595bCa2Df7d23783dFd126427CCeb997BF4",
      crvUsdUsdtGauge: "0x4e6bB6B7447B7B2Aa268C16AB87F4Bb48BF57939",
      sDaiUsdmPool: "0x425BfB93370F14fF525aDb6EaEAcfE1f4e3b5802",
      sDaiUsdmGauge: "0xcF5136C67fA8A375BaBbDf13c0307EF994b5681D",
      usdeUsdcPool: "0x02950460E2b9529D0E00284A5fA2d7bDF3fA4d72",
      usdeDaiPool: "0xF36a4BA50C603204c3FC6d2dA8b78A7b69CBC67d",
      mtEthenaPool: "0x167478921b907422F8E88B43C4Af2B8BEa278d3A",
      crvUsdUsdcPool: "0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E",
      crvUsdUsdcGauge: "0x95f00391cB5EebCd190EB58728B4CE23DbFa6ac1",
      ethxfPool: "0x59Ab5a5b5d617E478a2479B0cAD80DA7e2831492",
      ethxfGauge: "0x7671299eA7B4bbE4f3fD305A994e6443b4be680E",
      ankrCrvPool: "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2",
      ankrCrvGauge: "0x6d10ed2cF043E6fcf51A0e7b4C2Af3Fa06695707",
      btcGhoEthPool: "0x8a4f252812dFF2A8636E4F7EB249d8FC2E3bd77f",
      btcGhoEthGauge: "0x1E4B83f6bFE9dbeB6d5b92a5237E5c18a44176f4",
      wethRethPool: "0x9EfE1A1Cbd6Ca51Ee8319AFc4573d253C3B732af",
      wethRethGauge: "0xFB5B02863E2917AE1662598F7eBdE60AFEaFe84e",
    },
    enzyme: {
      depositWrapper2: "0x65BbAD6545B7ac9C30Fb0f07e64e25106Bf05eEc",
      divaStEthVault: "0x648B8d2340842a7040680915c4dAb89382eeEDA9",
      ethxHyperloopVaultComptrollerProxy:
        "0x251d885bC93BA2120A8376DA71a45189a228e3ef",
    },
    ethena: {
      sUsde: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
      sEna: "0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9",
    },
    etherfi: {
      liquidEth: "0xf0bb20865277aBd641a307eCe5Ee04E79073416C",
      tellerWithMultiAssetSupport: "0x5c135e8eC99557b412b9B4492510dCfBD36066F5",
      atomicQueue: "0xD45884B592E316eB816199615A95C182F75dea07",
      depositAdapter: "0xcfC6d9Bd7411962Bfe7145451A7EF71A24b6A7A2",
      eEth: "0x35fA164735182de50811E8e2E824cFb9B6118ac2",
      weEth: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      liquidityPool: "0x308861A430be4cce5502d0A12724771Fc6DaF216",
      withdrawRequestNft: "0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c",
    },
    fluid: {
      fAsset: "0x90551c1795392094FE6D29B758EcCD233cFAa260", // fWETH
    },
    gyroscope: {
      sGyd: "0xeA50f402653c41cAdbaFD1f788341dB7B7F37816",
    },
    idle: {
      stEthCdo: "0x34dCd573C5dE4672C8248cd12A99f875Ca112Ad8",
      wstEthAaGauge: "0x675eC042325535F6e176638Dd2d4994F645502B9",
      distributorProxy: "0x074306bc6a6fc1bd02b425dd41d742adf36ca9c6",
    },
    lido: {
      ...deFiKitContracts.mainnet.lido,
      aragonVoting: "0x2e59A20f205bB85a89C53f1936454680651E618e",
    },
    maverickV2: {
      rewardRouter: "0xc0C3BC532690af8922a2f260c6e1dEb6CFaB45A0",
      position: "0x116193c58B40D50687c0433B2aa0cC4AE00bC32c",
    },
    merkl: {
      angleDistributor: "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
    },
    mStableV2: {
      stkMta: "0x8f2326316eC696F6d023E37A9931c2b2C177a3D7",
    },
    nexus: {
      wNxm: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
      ramm: "0xcafea54f03E1Cc036653444e581A10a43B2487CD",
      stakingPool: "0xF3745f76C137738b0371a820A098fC678672660a", // Pool #2 (used as a general case)
      tokenController: "0x5407381b6c251cFd498ccD4A1d877739CB7960B8",
    },
    notionalV3: {
      nProxy: "0x6e7058c91F85E0F6db4fc9da2CA41241f5e4263f",
    },
    origin: {
      oEthZapper: "0x9858e47BCbBe6fBAC040519B02d7cd4B2C470C66",
      armOethWeth: "0x6bac785889A4127dB0e0CeFEE88E0a9F1Aaf3cC7",
      oEthVault: "0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab",
    },
    pancakeSwap: {
      smartRouter: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
    },
    pendle: {
      routerV4: "0x888888888889758F76e7103c6CbF23ABbF58F946",
    },
    pods: {
      ethAdapter: "0x4AAD0755eFd63F4e9B7Fac19Bd426db4a0d9b5E8",
      ethoriaVault: "0x5FE4B38520e856921978715C8579D2D7a4d2274F",
    },
    resolv: {
      stUsr: "0x6c8984bc7DBBeDAf4F6b2FD766f16eBB7d10AAb4",
    },
    safe: {
      singleton: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552", // GnosisSafe Implementation
      tokenLock: "0x0a7CB434f96f65972D46A5c1A64a9654dC9959b2",
      ecosystemAirdrop: "0x29067F28306419923BCfF96E37F95E0f58ABdBBe",
      userAirdrop: "0xA0b937D5c8E32a80E3a8ed4227CD020221544ee6",
      userAirdropSep5: "0xC0fde70A65C7569Fe919bE57492228DEE8cDb585",
    },
    siloV2: {
      router: "0x8658047e48CC09161f4152c79155Dac1d710Ff0a",
    },
    snapshot: {
      delegation: "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446",
    },
    sommelier: {
      turboDivEth: "0x6c1edce139291Af5b84fB1e496c9747F83E876c9",
    },
    stakeWiseV3: {
      ...deFiKitContracts.mainnet.stakeWiseV3,
      chrorusOneMevMax: "0xe6d8d8aC54461b1C5eD15740EEe322043F696C08",
      genesis: "0xAC0F906E433d58FA868F936E8A43230473652885",
    },
    sushiSwap: {
      router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
      routeProcessor3: "0x827179dD56d07A7eeA32e3873493835da2866976",
      routeProcessor32: "0x5550D13389bB70F45fCeF58f19f6b6e87F6e747d",
    },
    theGraph: {
      staking: "0xF55041E37E12cD407ad00CE2910B8269B01263b9",
      proxy: "0x01cDC91B0A9bA741903aA3699BF4CE31d6C5cC06",
    },
    uniswap: {
      uni: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    uniswapV2: {
      router2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    votium: {
      bribe: "0x19BBC3463Dd8d07f55438014b021Fb457EBD4595",
    },
    navCalculator: "0xF0125A04d74782e6d2aD6d298F0Bc786e301AAc1",
    wethOmnibridgeRouter: "0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a",
  },
  gnosis: {
    ...deFiKitContracts.gnosis,
    azuro: {
      lpAzrXdai: "0x204e7371Ade792c5C006fb52711c50a7efC843ed",
    },
    balancerV2: {
      ...deFiKitContracts.gnosis.balancerV2,
      bCowAmm50Weth50Gno: "0x079d2094e16210c42457438195042898a3CFF72d",
      bCowAmm50wstEth50sDai: "0x5089007DEC8E93f891dcB908c9E2Af8d9DEdb72E",
      bCowAmm50Gno50Olas: "0xD7f99B1CDa3EeCf6b6eAa8a61ed21d061E745400",
      bCowAmm50Gno50Cow: "0x71663f74490673706D7b8860B7D02b7c76160bAe",
      bCow50Gno50Safe: "0xAD58D2Bc841Cb8e4f8717Cb21e3FB6c95DCBc286",
      eclpBcspxSdaiGauge: "0xbcF4969d4dc6Cb86Ce0B8a101d220b558F14739C",
    },
    balancerV3: {
      compositeLiquidityRouter: "0x6eaD84Af26E997D27998Fc9f8614e8a19BB93938",
      router: "0x4eff2d77D9fFbAeFB4b141A3e494c085b3FF4Cb5",
      aaveLidoWethWstEth: "0x6e6bb18449fCF15B79EFa2CfA70ACF7593088029",
      aaveLidoWethWstEthGauge: "0x0fcE2d8428baca96b14f5D3D03D260940E11a066",
      aaveLido50WstEth50Gno: "0x272d6BE442E30D7c87390eDEb9B96f1E84cEcD8d",
      aaveLido50WstEth50GnoGauge: "0xcBD87e4Dad6a99506484E9adEEC8FF84Ce7BD399",
    },
    curve: {
      x3CrvPool: "0x7f90122BF0700F9E7e1F688fe926940E8839F353",
      crvEureUsdPool: "0x056C6C5e684CeC248635eD86033378Cc444459B0",
      crvEureUsdGauge: "0xd91770E868c7471a9585d1819143063A40c54D00",
      crvEureUsdZap: "0xE3FFF29d4DC930EBb787FeCd49Ee5963DADf60b6",
      eureEurc: "0x845C8bc94610807fCbaB5dd2bc7aC9DAbaFf3c55",
    },
    hop: {
      daiLiquidityPool: "0x24afDcA4653042C6D08fb1A754b2535dAcF6Eb24",
      lpDai: "0x5300648b1cFaa951bbC1d56a4457083D92CFa33F",
      daiRewards2: "0xBF7a02d963b23D84313F07a04ad663409CEE5A92",
    },
    hyperdrive: {
      wstEthLp: "0x2f840f1575EE77adAa43415Ac5953F7Db9F8C6ba",
      wxdaiSdaiLp: "0xEe9BFf933aDD313C4289E98dA80fEfbF9d5Cd9Ba",
    },
    stakeWiseV3: {
      ...deFiKitContracts.gnosis.stakeWiseV3,
      genesis: "0x4b4406Ed8659D03423490D8b62a1639206dA0A7a",
      serenita: "0x00025C729A3364FaEf02c7D1F577068d87E90ba6",
      nedo: "0x2Cd404D9d75436e7d6dDbCcc2fB9cF7C06941BF1",
      axol: "0x33C346928eD9249Cf1d5fc16aE32a8CFFa1671AD",
      stakecat: "0xe0A342ED4e0F0dBe97C4810534CfCB6550EA017D",
      stakesaurus: "0x3CB4692177525dB38D983DA0445d4EB25C3826dE",
      seednode: "0x9eeB6be79899CfE45018866A2113c6b77fa96F35",
    },
    uniswap: {
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  optimism: {
    ...deFiKitContracts.optimism,
    curve: {
      x3CrvPool: "0x1337BedC9D22ecbe766dF105c9623922A27963EC",
      crvUsdUsdcPool: "0x03771e24b7C9172d163Bf447490B142a15be3485",
      crvUsdUsdcePool: "0x05FA06D4Fb883F67f1cfEA0889edBff9e8358101",
      sUsd3CrvPool: "0x061b87122Ed14b9526A813209C8a59a633257bAb",
    },
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  arbitrumOne: {
    ...deFiKitContracts.arbitrumOne,
    gmx: {
      exchangeRouter: "0x5aC4e27341e4cCcb3e5FD62f9E62db2Adf43dd57",
    },
    gyroscope: {
      sGyd: "0xeA50f402653c41cAdbaFD1f788341dB7B7F37816",
      stSgyd: "0xb4C19C1b16881A6d1d781264f0f8C0237D8Be0C7",
    },
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
  base: {
    ...deFiKitContracts.base,
    sushiSwap: {
      routeProcessor4: "0x0389879e0156033202C44BF784ac18fC02edeE4f",
    },
    navCalculator: "0x4AbE155C97009e388E0493fe1516F636e0F3a390",
  },
} as const

export default defineConfig({
  rpc: {
    mainnet: "https://ethereum-rpc.publicnode.com",
    gnosis: "https://rpc.gnosischain.com/",
    //gnosis: "https://rpc.ankr.com/gnosis"
    optimism: "https://optimism-rpc.publicnode.com",
    arbitrumOne: "https://arb1.arbitrum.io/rpc",
    base: "https://base-rpc.publicnode.com",
  },
  contracts,
})
