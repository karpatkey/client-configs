/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Integrity, IntegrityInterface } from "../../contracts/Integrity";

const _abi = [
  {
    inputs: [],
    name: "NotBFS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsuitableChildCount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsuitableChildTypeTree",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsuitableCompValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsuitableParameterType",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsuitableParent",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsuitableRootNode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "UnsupportedOperator",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "parent",
            type: "uint8",
          },
          {
            internalType: "enum ParameterType",
            name: "paramType",
            type: "ParameterType",
          },
          {
            internalType: "enum Operator",
            name: "operator",
            type: "Operator",
          },
          {
            internalType: "bytes",
            name: "compValue",
            type: "bytes",
          },
        ],
        internalType: "struct ConditionFlat[]",
        name: "conditions",
        type: "tuple[]",
      },
    ],
    name: "enforce",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x611605610035600b8282823980515f1a60731461002957634e487b7160e01b5f525f60045260245ffd5b305f52607381538281f3fe7300000000000000000000000000000000000000003014608060405260043610610034575f3560e01c8063783a904714610038575b5f80fd5b61004b610046366004611386565b61004d565b005b610056816100a1565b5f5b815181101561009457610084828281518110610076576100766114b8565b602002602001015182610141565b61008d816114e0565b9050610058565b5061009e8161067b565b50565b5f805b82518110156100ef57808382815181106100c0576100c06114b8565b60200260200101515f015160ff16036100df576100dc826114e0565b91505b6100e8816114e0565b90506100a4565b5080600114158061011f5750815f8151811061010d5761010d6114b8565b60200260200101515f015160ff165f14155b1561013d57604051632f48858160e21b815260040160405180910390fd5b5050565b6040820151602083015160608401515f83601f811115610163576101636114f8565b03610199576060850151511561019457604051632d6ee65d60e21b8152600481018590526024015b60405180910390fd5b610674565b600183601f8111156101ad576101ad6114f8565b101580156101cd5750600383601f8111156101ca576101ca6114f8565b11155b1561022d575f8260068111156101e5576101e56114f8565b146102065760405163de10075b60e01b81526004810185905260240161018b565b6060850151511561019457604051632d6ee65d60e21b81526004810185905260240161018b565b600583601f811115610241576102416114f8565b036102fa57600382600681111561025a5761025a6114f8565b1415801561027a57506004826006811115610277576102776114f8565b14155b801561029857506005826006811115610295576102956114f8565b14155b80156102b6575060068260068111156102b3576102b36114f8565b14155b156102d75760405163de10075b60e01b81526004810185905260240161018b565b80511561019457604051632d6ee65d60e21b81526004810185905260240161018b565b600683601f81111561030e5761030e6114f8565b148061032b5750600783601f811115610329576103296114f8565b145b806103475750600883601f811115610345576103456114f8565b145b156103825760045b826006811115610361576103616114f8565b146102d75760405163de10075b60e01b81526004810185905260240161018b565b600f83601f811115610396576103966114f8565b036103a257600161034f565b601083601f8111156103b6576103b66114f8565b036104875760018260068111156103cf576103cf6114f8565b141580156103ef575060028260068111156103ec576103ec6114f8565b14155b801561040d5750600382600681111561040a5761040a6114f8565b14155b801561042b57506004826006811115610428576104286114f8565b14155b1561044c5760405163de10075b60e01b81526004810185905260240161018b565b80511580610466575060208151610463919061150c565b15155b1561019457604051632d6ee65d60e21b81526004810185905260240161018b565b601183601f81111561049b5761049b6114f8565b14806104b85750601283601f8111156104b6576104b66114f8565b145b806104d45750601383601f8111156104d2576104d26114f8565b145b806104f05750601483601f8111156104ee576104ee6114f8565b145b156105505760015b82600681111561050a5761050a6114f8565b1461052b5760405163de10075b60e01b81526004810185905260240161018b565b805160201461019457604051632d6ee65d60e21b81526004810185905260240161018b565b601583601f811115610564576105646114f8565b036105be57600182600681111561057d5761057d6114f8565b1415801561059d5750600282600681111561059a5761059a6114f8565b14155b1561052b5760405163de10075b60e01b81526004810185905260240161018b565b601683601f8111156105d2576105d26114f8565b036105fc57805160201461019457604051632d6ee65d60e21b81526004810185905260240161018b565b601c83601f811115610610576106106114f8565b0361061c5760016104f8565b601d83601f811115610630576106306114f8565b148061064d5750601e83601f81111561064b5761064b6114f8565b145b15610658575f6104f8565b604051630a7d7b8960e41b81526004810185905260240161018b565b5050505050565b805160015b818110156107035782818151811061069a5761069a6114b8565b60200260200101515f015160ff16836001836106b6919061152b565b815181106106c6576106c66114b8565b60200260200101515f015160ff1611156106f357604051638484738160e01b815260040160405180910390fd5b6106fc816114e0565b9050610680565b505f5b8181101561080457601d838281518110610722576107226114b8565b602002602001015160400151601f81111561073f5761073f6114f8565b14806107795750601e83828151811061075a5761075a6114b8565b602002602001015160400151601f811115610777576107776114f8565b145b80156107d35750600583848381518110610795576107956114b8565b60200260200101515f015160ff16815181106107b3576107b36114b8565b60200260200101516020015160068111156107d0576107d06114f8565b14155b156107f457604051631d40413960e11b81526004810182905260240161018b565b6107fd816114e0565b9050610706565b505f61080f83610c83565b90505f5b8351811015610b59575f84828151811061082f5761082f6114b8565b602002602001015190505f83838151811061084c5761084c6114b8565b602002602001015190505f6006811115610868576108686114f8565b8260200151600681111561087e5761087e6114f8565b0361095957601d8260400151601f81111561089b5761089b6114f8565b14806108bc5750601e8260400151601f8111156108ba576108ba6114f8565b145b80156108cb5750604081015115155b156108ec5760405163f3379ddd60e01b81526004810184905260240161018b565b60018260400151601f811115610904576109046114f8565b10158015610928575060038260400151601f811115610925576109256114f8565b11155b156109545780604001515f036109545760405163f3379ddd60e01b81526004810184905260240161018b565b610b44565b600182602001516006811115610971576109716114f8565b14806109925750600282602001516006811115610990576109906114f8565b145b156109bd576040810151156109545760405163f3379ddd60e01b81526004810184905260240161018b565b6003826020015160068111156109d5576109d56114f8565b14806109f657506005826020015160068111156109f4576109f46114f8565b145b80610a165750600682602001516006811115610a1457610a146114f8565b145b15610a425780604001515f036109545760405163f3379ddd60e01b81526004810184905260240161018b565b600482602001516006811115610a5a57610a5a6114f8565b14610a6757610a67611544565b80604001515f03610a8e5760405163f3379ddd60e01b81526004810184905260240161018b565b60068260400151601f811115610aa657610aa66114f8565b1480610ac7575060078260400151601f811115610ac557610ac56114f8565b145b8015610ad857508060400151600114155b15610af95760405163f3379ddd60e01b81526004810184905260240161018b565b60088260400151601f811115610b1157610b116114f8565b148015610b2357506101008160400151115b15610b445760405163f3379ddd60e01b81526004810184905260240161018b565b50508080610b51906114e0565b915050610813565b505f5b8351811015610c3b575f848281518110610b7857610b786114b8565b602002602001015190506001601f811115610b9557610b956114f8565b8160400151601f811115610bab57610bab6114f8565b10158015610bcf575060038160400151601f811115610bcc57610bcc6114f8565b11155b80610bef5750600481602001516006811115610bed57610bed6114f8565b145b8015610c1857506001838381518110610c0a57610c0a6114b8565b602002602001015160400151115b15610c2857610c28858385610dcd565b5080610c33816114e0565b915050610b5c565b505f610c48845f84610e82565b9050600581516006811115610c5f57610c5f6114f8565b14610c7d57604051632f48858160e21b815260040160405180910390fd5b50505050565b805160609080610c9557610c95611544565b806001600160401b03811115610cad57610cad61129c565b604051908082528060200260200182016040528015610cff57816020015b610cec60405180606001604052805f81526020015f81526020015f81525090565b815260200190600190039081610ccb5790505b5091505f19825f81518110610d1657610d166114b8565b60209081029190910101515260015b81811015610dc6575f19838281518110610d4157610d416114b8565b60200260200101515f0181815250505f83858381518110610d6457610d646114b8565b60200260200101515f015160ff1681518110610d8257610d826114b8565b602002602001015190505f19815f015103610d9b578181525b610da6826001611558565b602082018190528151610db89161152b565b604090910152600101610d25565b5050919050565b5f818381518110610de057610de06114b8565b60200260200101515f015190505f828481518110610e0057610e006114b8565b60200260200101516020015190505f826001610e1c9190611558565b90505b81811015610e7a57610e3386848387611101565b158015610e495750610e478684838761112d565b155b15610e6a576040516303a3183b60e61b81526004810186905260240161018b565b610e73816114e0565b9050610e1f565b505050505050565b604080518082019091525f8152606060208201525f848481518110610ea957610ea96114b8565b602002602001015190506001601f811115610ec657610ec66114f8565b8160400151601f811115610edc57610edc6114f8565b10158015610f00575060038160400151601f811115610efd57610efd6114f8565b11155b15610f60575f838581518110610f1857610f186114b8565b60200260200101516040015111610f3157610f31611544565b610f5885848681518110610f4757610f476114b8565b60200260200101515f015185610e82565b9150506110fa565b602081015182906006811115610f7857610f786114f8565b90816006811115610f8b57610f8b6114f8565b815250505f838581518110610fa257610fa26114b8565b60200260200101516040015111156110f8575f838581518110610fc757610fc76114b8565b60209081029190910101515190505f600483602001516006811115610fee57610fee6114f8565b1461101657848681518110611005576110056114b8565b60200260200101516020015161103f565b848681518110611028576110286114b8565b60200260200101515f0151600161103f9190611558565b905061104b828261152b565b6001600160401b038111156110625761106261129c565b6040519080825280602002602001820160405280156110a757816020015b604080518082019091525f8152606060208201528152602001906001900390816110805790505b506020850152815b818110156110f4576110c2888288610e82565b60208601516110d1858461152b565b815181106110e1576110e16114b8565b60209081029190910101526001016110af565b5050505b505b9392505050565b5f611115611110868585610e82565b6111a0565b611123611110878786610e82565b1495945050505050565b5f8061113a868685610e82565b5190506005816006811115611151576111516114f8565b148061116e5750600681600681111561116c5761116c6114f8565b145b801561119657506002611182878686610e82565b516006811115611194576111946114f8565b145b9695505050505050565b6020810151515f908015611289575f8360200151516001600160401b038111156111cc576111cc61129c565b6040519080825280602002602001820160405280156111f5578160200160208202803683370190505b5090505f5b82811015611255576112288560200151828151811061121b5761121b6114b8565b60200260200101516111a0565b82828151811061123a5761123a6114b8565b602090810291909101015261124e816114e0565b90506111fa565b50835160405161126a9190839060200161156b565b6040516020818303038152906040528051906020012092505050919050565b825160068111156110fa576110fa6114f8565b634e487b7160e01b5f52604160045260245ffd5b604051608081016001600160401b03811182821017156112d2576112d261129c565b60405290565b604051601f8201601f191681016001600160401b03811182821017156113005761130061129c565b604052919050565b803560208110611316575f80fd5b919050565b5f82601f83011261132a575f80fd5b81356001600160401b038111156113435761134361129c565b611356601f8201601f19166020016112d8565b81815284602083860101111561136a575f80fd5b816020850160208301375f918101602001919091529392505050565b5f6020808385031215611397575f80fd5b82356001600160401b03808211156113ad575f80fd5b818501915085601f8301126113c0575f80fd5b8135818111156113d2576113d261129c565b8060051b6113e18582016112d8565b91825283810185019185810190898411156113fa575f80fd5b86860192505b838310156114ab57823585811115611417575f8081fd5b86016080818c03601f190181131561142e575f8081fd5b6114366112b0565b8983013560ff81168114611449575f8081fd5b81526040838101356007811061145e575f8081fd5b828c0152606061146f858201611308565b83830152928401359289841115611487575f91508182fd5b6114958f8d8688010161131b565b9083015250845250509186019190860190611400565b9998505050505050505050565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b5f600182016114f1576114f16114cc565b5060010190565b634e487b7160e01b5f52602160045260245ffd5b5f8261152657634e487b7160e01b5f52601260045260245ffd5b500690565b8181038181111561153e5761153e6114cc565b92915050565b634e487b7160e01b5f52600160045260245ffd5b8082018082111561153e5761153e6114cc565b5f6007841061158857634e487b7160e01b5f52602160045260245ffd5b8360f81b82526001602d60f81b8184015260028301845160208087015f5b838110156115c15781518552938201939082019085016115a6565b50929897505050505050505056fea26469706673582212201c1e03ab2a1598caac0eb26e3051d530e58d0f65d2024008f73f7ba8fcfec77f64736f6c63430008150033";

type IntegrityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: IntegrityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Integrity__factory extends ContractFactory {
  constructor(...args: IntegrityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Integrity> {
    return super.deploy(overrides || {}) as Promise<Integrity>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Integrity {
    return super.attach(address) as Integrity;
  }
  override connect(signer: Signer): Integrity__factory {
    return super.connect(signer) as Integrity__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): IntegrityInterface {
    return new utils.Interface(_abi) as IntegrityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Integrity {
    return new Contract(address, _abi, signerOrProvider) as Integrity;
  }
}
