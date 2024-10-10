import { EthSdkConfig, defineConfig } from "@dethcrypto/eth-sdk"

export const contracts = {
  mainnet: {
    aave_v2: {
      lending_pool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      stkAave: "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
      gho: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
    },
    aave_v3: {
      pool_v3: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
      wrapped_token_gateway_v3: "0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9",
      wrapped_token_gateway_lido_v3:
        "0x702B6770A81f75964cA5D479F369eFB31dfa7C32",
      pool_lido: "0x4e033931ad43597d96D6bcc25c280717730B58B1",
      aEthWETH: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
    },
    across_v2: {
      hub_pool_v2: "0xc186fA914353c44b2E33eBE05f21846F1048bEda",
    },
    ankr: {
      ETH2_Staking: "0x84db6ee82b7cf3b47e8f19270abde5718b936670",
      flashUnstake: "0xf047f23ACFdB1315cF63Ad8aB5146d5fDa4267Af",
    },
    aura: {
      booster: "0xA57b8d98dAE62B26Ec3bcC4a365338157060B234",
      reward_deposit_wrapper: "0xB188b1CB84Fb0bA13cb9ee1292769F903A9feC59",
      rewarder: "0x2a14dB8D09dB0542f6A371c0cB308A768227D67D", // auraB_stETH_stable_rewarder
      // auraB_auraBAL_stable_rewarder:
      //   "0x89D3D732da8bf0f88659Cf3738E5E44e553f9ED7",
      // auraB_rETH_stable_rewarder: "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D",
      // auraB_80GNO_20WETH_rewarder: "0x971fAF6BE8C20f53fe3acF065fe6E14FBA0b8a9a",
      // aura50COW_50GNO_rewarder: "0x82FeB430d9D14eE5E635C41807e03fD8F5FfFDeC",
      // aura50WSTETH_50LDO_rewarder: "0x5209dB28b3cF22a944401c83370Af7A703ffFb08",
      // aura50WETH_50AURA_rewarder: "0x1204f5060bE8b716F5A62b4Df4cE32acD01a69f5",
      // aura50COW_50WETH_rewarder: "0xA6e54eA1C67396Bde9e92cA462197bE59Af3E875",
      // auraBAL_staking_rewarder: "0x00A7BA8Ae7bca0B10A32Ea1f8e2a1Da980c6CAd2",
      // aurabb_aV3_USD_rewarder: "0xD48451A61d5190a1Ba7C9D17056490cB5d50999d",
      // aura_locker: "0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC",
      // snapshot_delegate_registry: "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446",
      // claim_zap: "0x5b2364fD757E262253423373E4D57C5c011Ad7F4",
      // stkauraBAL: "0xfAA2eD111B4F580fCb85C48E6DC6782Dc5FCD7a6",
      // auraBAL_B_80BAL_20WETH_depositor:
      //  "0xeAd792B55340Aa20181A80d6a16db6A0ECd1b827",
      // auraBAL_BAL_depositor: "0x68655AD9852a99C87C0934c7290BB62CFa5D4123",
      // auraBAL_compounding_rewarder:
      //  "0xAc16927429c5c7Af63dD75BC9d8a58c63FfD0147",
    },
    angle: {
      wstETH_EUR_Vault: "0x73aaf8694BA137a7537E7EF544fcf5E2475f227B",
    },
    autonolas: {
      veolas: "0x7e01A500805f8A52Fad229b3015AD130A332B7b3",
    },
    azuro: {
      stAZUR: "0x67f3228fD58f5A26D93a5dd0c6989b69c95618eB",
    },
    balancer: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      relayer: "0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f",
      gauge: "0x5C0F23A5c1be65Fa710d385814a7Fd1Bda480b1C",
      bpt: "0x93d199263632a4EF4Bb438F1feB99e57b4b5f0BD",
      // B_stETH_stable_gauge: "0x5C0F23A5c1be65Fa710d385814a7Fd1Bda480b1C",
      // B_auraBAL_stable_gauge: "0x0312AA8D0BA4a1969Fddb382235870bF55f7f242",
      // B_rETH_stable_gauge: "0x79eF6103A513951a3b25743DB509E267685726B7",
      // B_80GNO_20WETH_gauge: "0xCB664132622f29943f67FA56CCfD1e24CC8B4995",
      // B_50COW_50GNO_gauge: "0xA6468eca7633246Dcb24E5599681767D27d1F978",
      // B_50WSTETH_50LDO_gauge: "0x95201b61ef19c867da0d093df20021e1a559452c",
      // B_50WETH_50AURA_gauge: "0x275dF57d2B23d53e20322b4bb71Bf1dCb21D0A00",
      // B_50COW_50WETH_gauge: "0x158772F59Fe0d3b75805fC11139b46CBc89F70e5",
      // bb_a_USD_gauge: "0xa6325e799d266632D347e41265a69aF111b05403",
      // bb_aV3_USD_gauge: "0x0052688295413b32626D226a205b95cDB337DE86",
      BAL_minter: "0x239e55f427d44c3cc793f49bfb507ebe76638a2b",
      fee_distributor: "0xD3cf852898b21fc233251427c2DC93d3d604F3BB",
      veBAL: "0xC128a9954e6c874eA3d62ce62B468bA073093F25",
      BCoW_50COW_50wstETH: "0x9bd702E05B9c97E4A4a3E47Df1e0fe7A0C26d2F1",
      BCoW_50WETH_50USDC: "0xf08D4dEa369C456d26a3168ff0024B904F2d8b91",
      BCoW_50WETH_50USDC_gauge: "0xF9423B78D784D610A00955E733dBa0bf9bda7B06",
      BCoW_50wNXM_50WETH: "0x7c838b3Ed3C15a5d5032e809B8714f0aE5e9A821",
    },
    compound_v2: {
      comptroller: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
      cometRewards: "0x1B0e765F6224C21223AeA2af16c1C46E38885a40",
      cUSDC: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
      cDAI: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      cAAVE: "0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c",
    },
    compound_v3: {
      cUSDCv3: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      cUSDTv3: "0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840",
      cWETHv3: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
      MainnetBulker: "0xa397a8C2086C554B531c02E29f3291c9704B00c7",
      CometRewards: "0x1b0e765f6224c21223aea2af16c1c46e38885a40",
    },
    convex: {
      booster: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
      // snapshot_delegation: "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446",
      // crv_depositor: "0x8014595F2AB54cD7c604B00E9fb932176fDc86Ae",
      // stkCvxCrv: "0xaa0C3f5F7DFD688C6E646F66CD2a6B66ACdbE434",
      // cvxRewardPool: "0xCF50b810E57Ac33B91dCF525C6ddd9881B139332",
      // vlCVX: "0x72a19342e8F1838460eBFCCEf09F6585e32db86E",
      rewarder: "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03", // cvxsteCRV_rewarder
      // cvxsteCRV_rewarder: "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03",
      // cvxcDAIcUSDC_rewarder: "0xf34DFF761145FF0B05e917811d488B441F33a968",
      // claim_zap: "0x3f29cb4111cbda8081642da1f75b3c12decf2516",
    },
    cowswap: {
      order_signer: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
      gpv2_vault_relayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
      vCOW: "0xD057B63f5E69CF1B929b356b579Cba08D7688048",
    },
    curve: {
      crv_minter: "0xd061D61a4d941c39E5453435B6345Dc261C2fcE0",
      stake_deposit_zap_v1: "0x271fbE8aB7f1fB262f81C77Ea5303F03DA9d3d6A",
      stake_deposit_zap: "0x56C526b0159a258887e0d79ec3a80dfb940d0cD7",
      steth_eth_pool: "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
      steth_eth_gauge: "0x182B723a58739a9c974cFDB385ceaDb237453c28",
      oseth_reth_pool: "0xe080027Bd47353b5D1639772b4a75E9Ed3658A0d",
      oseth_reth_gauge: "0x63037a4e3305d25D48BAED2022b8462b2807351c",
      cDAIcUSDC_pool: "0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56",
      cDAIcUSDC_gauge: "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575",
      cDAIcUSDC_zap: "0xeB21209ae4C2c9FF2a86ACA31E123764A3B6Bc06",
      x3CRV_pool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
      cvxETH_pool: "0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4",
      ankrETH_pool: "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2",
      stETH_ng_f_pool: "0x21E27a5E5513D6e65C4f830167390997aA84843a",
      stETH_ng_f_gauge: "0x79F21BC30632cd40d2aF8134B469a0EB4C9574AA",
      tricryptoGHO_pool: "0x8Cd52ee292313C4D851e71A7064F096504aB3eE9",
      tricryptoGHO_gauge: "0x6373E119F2A1Fd081249BC16FE7FEA1F6b3A4Ca8",
    },
    enzyme: {
      deposit_wrapper_2: "0x65BbAD6545B7ac9C30Fb0f07e64e25106Bf05eEc",
      Diva_stETH_Vault: "0x648B8d2340842a7040680915c4dAb89382eeEDA9",
    },
    gyroscope: {
      sGYD: "0xeA50f402653c41cAdbaFD1f788341dB7B7F37816",
    },
    idle: {
      stEthCdo: "0x34dCd573C5dE4672C8248cd12A99f875Ca112Ad8",
      wstEthAaGauge: "0x675eC042325535F6e176638Dd2d4994F645502B9",
      distributorProxy: "0x074306bc6a6fc1bd02b425dd41d742adf36ca9c6",
    },
    lido: {
      stETH: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      wstETH: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      unstETH: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
    },
    maker: {
      cdp_manager: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
      dsr_manager: "0x373238337Bfe1146fb49989fc222523f83081dDb",
      jug: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
      vat: "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
      dai_join: "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
      gem_join: "0x10CD5fbe1b404B7E19Ef964B63939907bdaf42E2",
      ds_proxy: "0xD758500ddEc05172aaA035911387C8E0e789CF6a", // GnosisDAO DSProxy
    },
    merkl: {
      angle_distributor: "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
    },
    morpho: {
      morpho_blue: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
    },
    mstable_v2: {
      stkMTA: "0x8f2326316eC696F6d023E37A9931c2b2C177a3D7",
    },
    nexus: {
      wNXM: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
      ramm: "0xcafea54f03E1Cc036653444e581A10a43B2487CD",
      staking_pool: "0xF3745f76C137738b0371a820A098fC678672660a", // Pool #2 (used as a general case)
      token_controller: "0x5407381b6c251cFd498ccD4A1d877739CB7960B8",
    },
    notional: {
      nProxy: "0x1344A36A1B56144C3Bc62E7757377D288fDE0369",
    },
    pancake_swap: {
      smart_router: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
    },
    pods: {
      ETHAdapter: "0x4AAD0755eFd63F4e9B7Fac19Bd426db4a0d9b5E8",
      ETHoriaVault: "0x5FE4B38520e856921978715C8579D2D7a4d2274F",
    },
    rocket_pool: {
      deposit_pool: "0xDD3f50F8A6CafbE9b31a427582963f465E745AF8", // This address might due to Rocket Pool's Architecture
      rETH: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      swap_router: "0x16D5A408e807db8eF7c578279BEeEe6b228f1c1C",
    },
    safe: {
      token_lock: "0x0a7CB434f96f65972D46A5c1A64a9654dC9959b2",
      ecosystem_airdrop: "0x29067F28306419923BCfF96E37F95E0f58ABdBBe",
      user_airdrop: "0xA0b937D5c8E32a80E3a8ed4227CD020221544ee6",
      user_airdrop_sep5: "0xC0fde70A65C7569Fe919bE57492228DEE8cDb585",
    },
    silo_v2: {
      router: "0x8658047e48CC09161f4152c79155Dac1d710Ff0a",
    },
    sommelier: {
      TurboDIVETH: "0x6c1edce139291Af5b84fB1e496c9747F83E876c9",
    },
    spark: {
      sparkLendingPoolV3: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      sDAI: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
    },
    stader: {
      staking_pool_manager: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
      user_withdraw_manager: "0x9F0491B32DBce587c50c4C43AB303b06478193A7",
    },
    stakedao: {
      bribe: "0x0000000BE1d98523B5469AfF51A1e7b4891c6225",
    },
    stakewise_v2: {
      eth2_staking: "0xC874b064f465bdD6411D45734b56fac750Cda29A",
      merkle_distributor: "0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20",
    },
    stakewise_v3: {
      chrorus_one_mev_max: "0xe6d8d8aC54461b1C5eD15740EEe322043F696C08",
      genesis: "0xAC0F906E433d58FA868F936E8A43230473652885",
    },
    sushiswap: {
      router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
      route_processor_3: "0x827179dD56d07A7eeA32e3873493835da2866976",
      route_processor_3_2: "0x5550D13389bB70F45fCeF58f19f6b6e87F6e747d",
    },
    the_graph: {
      staking: "0xF55041E37E12cD407ad00CE2910B8269B01263b9",
      proxy: "0x01cDC91B0A9bA741903aA3699BF4CE31d6C5cC06",
    },
    uniswap_v2: {
      router_2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    uniswap_v3: {
      positions_nft: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      router_2: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    },
    votium: {
      bribe: "0x19BBC3463Dd8d07f55438014b021Fb457EBD4595",
    },
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    gno_omnibridge: "0x88ad09518695c6c3712AC10a214bE5109a655671",
    gno_xdai_bridge: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
    amb_eth_xdai: "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e",
    opt_dai_bridge: "0x10E6593CDda8c58a1d0f14C5164B376352a55f2F",
    circle_token_messenger: "0xBd3fa81B58Ba92a82136038B25aDec7066af3155",
    opt_gateway: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
    arb_dai_gateway: "0xD3B5b60020504bc3489D6949d545893982BA3011",
    arb_erc20_gateway: "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC",
    circle_message_transmitter: "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
    l1_hop_cctp: "0x7e77461CA2a9d82d26FD5e0Da2243BF72eA45747",
    hop_dai_bridge: "0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1",
    connext_bridge: "0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6",
    arb_l1_gateway_router: "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef",
  },
  gnosis: {
    aave_v3: {
      pool_v3: "0xb50201558B00496A145fE76f7424749556E326D8",
      wrapped_token_gateway_v3: "0xfE76366A986B72c3f2923e05E6ba07b7de5401e4",
      variable_debt_wxdai: "0x281963D7471eCdC3A2Bd4503e24e89691cfe420D",
      aGnoWXDAI: "0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533",
    },
    agave: {
      SavingsXDaiAdapter: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
    },
    balancer: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0x27519F69b2Ac912aeb6fE066180FB25a17c71755",
      bpt: "0xbAd20c15A773bf03ab973302F61FAbceA5101f0A",
    },
    cowswap: {
      order_signer: "0x23dA9AdE38E4477b23770DeD512fD37b12381FAB",
      gpv2_vault_relayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
    },
    stakewise_v3: {
      genesis: "0x4b4406Ed8659D03423490D8b62a1639206dA0A7a",
      serenita: "0x00025C729A3364FaEf02c7D1F577068d87E90ba6",
      nedo: "0x2Cd404D9d75436e7d6dDbCcc2fB9cF7C06941BF1",
    },
    curve: {
      x3CRV_pool: "0x7f90122BF0700F9E7e1F688fe926940E8839F353",
    },
    spark: {
      sparkLendingPoolV3: "0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0",
      wrappedTokenGatewayV3: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
      variableDebtWXDAI: "0x868ADfDf12A86422524EaB6978beAE08A0008F37",
      aWXDAI: "0xC9Fe2D32E96Bb364c7d29f3663ed3b27E30767bB",
    },
    comp: "0xDf6FF92bfDC1e8bE45177DC1f4845d391D3ad8fD",
    gno: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
    usdc: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    usdc_transmuter: "0x0392A2F5Ac47388945D8c84212469F545fAE52B2",
    wxdai: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    xdai_bridge: "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d",
    xdai_bridge_2: "0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6",
    hop_dai_wrapper: "0x6C928f435d1F3329bABb42d69CCF043e3900EcF1",
    connext_bridge: "0x5bb83e95f63217cda6ae3d181ba580ef377d2109",
  },
  optimism: {
    aave_v3: {
      pool_v3: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
    balancer: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0xA30992B40a0cb4B2Da081ddBd843f9CcE25c2fe3",
      bpt: "0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2",
    },
    compound_v3: {
      cUSDCv3: "0x2e44e174f7D53F0212823acC11C01A11d58c5bCB",
      CometRewards: "0x443EA0340cb75a160F31A440722dec7b5bc3C2E9",
    },
    curve: {
      x3CRV_pool: "0x1337BedC9D22ecbe766dF105c9623922A27963EC",
      crvUSD_USDC_pool: "0x03771e24b7C9172d163Bf447490B142a15be3485",
      crvUSD_USDCe_pool: "0x05FA06D4Fb883F67f1cfEA0889edBff9e8358101",
      sUSD3CRV_f_pool: "0x061b87122Ed14b9526A813209C8a59a633257bAb",
    },
    circle_token_messenger: "0x2B4069517957735bE00ceE0fadAE88a26365528f",
    dai_token_bridge: "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65",
    optimism_bridge: "0x4200000000000000000000000000000000000010",
    circle_message_transmitter: "0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8",
    l2_hop_cctp: "0x469147af8Bde580232BE9DC84Bb4EC84d348De24",
    hop_dai_wrapper: "0xb3C68a491608952Cb1257FC9909a537a0173b63B",
    connext_bridge: "0x8f7492DE823025b4CfaAB1D34c58963F2af5DEDA",
  },
  arbitrumOne: {
    aave_v3: {
      pool_v3: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
    balancer: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0x260cbb867359a1084eC97de4157d06ca74e89415",
      bpt: "0x9791d590788598535278552EEcD4b211bFc790CB",
    },
    compound_v3: {
      cUSDCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
      CometRewards: "0x88730d254A2f7e6AC8388c3198aFd694bA9f7fae",
    },
    gateway_router: "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933",
    circle_token_messenger: "0x19330d10D9Cc8751218eaf51E8885D058642E08A",
    circle_message_transmitter: "0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca",
    l2_hop_cctp: "0x6504BFcaB789c35325cA4329f1f41FaC340bf982",
    hop_dai_wrapper: "0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2",
    connext_bridge: "0xEE9deC2712cCE65174B561151701Bf54b99C24C8",
  },
  base: {
    aave_v3: {
      pool_v3: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
    },
    balancer: {
      vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      gauge: "0x8D118063B521e0CB9947A934BE90f7e32d02b158",
      bpt: "0xC771c1a5905420DAEc317b154EB13e4198BA97D0",
    },
    compound_v3: {
      cUSDCv3: "0xb125E6687d4313864e53df431d5425969c15Eb2F",
      CometRewards: "0x123964802e6ABabBE1Bc9547D72Ef1B69B00A6b1",
    },
    sushiswap: {
      route_processor_4: "0x0389879e0156033202C44BF784ac18fC02edeE4f",
    },
    circle_token_messenger: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
    circle_message_transmitter: "0xAD09780d193884d503182aD4588450C416D6F9D4",
    l2_hop_cctp: "0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2",
    connext_bridge: "0xB8448C6f7f7887D36DcA487370778e419e9ebE3F",
  },
} satisfies EthSdkConfig["contracts"]

export default defineConfig({
  etherscanURLs: {
    gnosis: "https://api.gnosisscan.io/api",
    // gnosis: "https://blockscout.com/xdai/mainnet/api",
    optimism: "https://api-optimistic.etherscan.io/api",
    arbitrumOne: "https://api.arbiscan.io/api",
    base: "https://api.basescan.org/api",
  },
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
