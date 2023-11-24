/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Packer,
  PackerInterface,
} from "../../../contracts/packers/Packer";

const _abi = [
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
        name: "conditionsFlat",
        type: "tuple[]",
      },
    ],
    name: "pack",
    outputs: [
      {
        internalType: "bytes",
        name: "buffer",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x61085a610035600b8282823980515f1a60731461002957634e487b7160e01b5f525f60045260245ffd5b305f52607381538281f3fe7300000000000000000000000000000000000000003014608060405260043610610034575f3560e01c8063806362d214610038575b5f80fd5b61004b610046366004610602565b610061565b6040516100589190610735565b60405180910390f35b606061006c82610184565b61007582610246565b67ffffffffffffffff81111561008d5761008d610515565b6040519080825280601f01601f1916602001820160405280156100b7576020820181803683370190505b5082519091505f6100c9826002610794565b6100d49060206107ab565b90505f5b8281101561017c5761010484828784815181106100f7576100f76107be565b60200260200101516102bc565b6010858281518110610118576101186107be565b602002602001015160400151601f811115610135576101356107d2565b1061016c5761015e8483878481518110610151576101516107be565b6020026020010151610369565b6101696020836107ab565b91505b610175816107e6565b90506100d8565b505050919050565b80515f5b818110156102415760108382815181106101a4576101a46107be565b602002602001015160400151601f8111156101c1576101c16107d2565b1480156101d557506101d383826103b3565b155b15610231575f8382815181106101ed576101ed6107be565b60200260200101516060015190505f815190506020820191506020810382528185848151811061021f5761021f6107be565b60200260200101516060018190525050505b61023a816107e6565b9050610188565b505050565b80515f90610255600282610794565b91505f5b818110156102b5576010848281518110610275576102756107be565b602002602001015160400151601f811115610292576102926107d2565b106102a5576102a26020846107ab565b92505b6102ae816107e6565b9050610259565b5050919050565b5f6102c8600284610794565b9050815f015160f81b8482815181106102e3576102e36107be565b60200101906001600160f81b03191690815f1a9053508160400151601f81111561030f5761030f6107d2565b60208301516005906006811115610328576103286107d2565b60ff16901b1760f81b8461033d8360016107ab565b8151811061034d5761034d6107be565b60200101906001600160f81b03191690815f1a90535050505050565b5f60108260400151601f811115610382576103826107d2565b1461039a578160600151610395906107fe565b6103a7565b8160600151805190602001205b93909201929092525050565b5f808383815181106103c7576103c76107be565b6020026020010151602001519050600160068111156103e8576103e86107d2565b8160068111156103fa576103fa6107d2565b0361040957600191505061050f565b600281600681111561041d5761041d6107d2565b148061043a57506004816006811115610438576104386107d2565b145b8061045657506005816006811115610454576104546107d2565b145b8061047257506006816006811115610470576104706107d2565b145b15610480575f91505061050f565b83515f61048e8560016107ab565b90505b81811015610507575f8682815181106104ac576104ac6107be565b60200260200101515f01519050858160ff1610156104ca57506104f7565b858160ff1611156104db5750610507565b6104e587836103b3565b6104f5575f94505050505061050f565b505b610500816107e6565b9050610491565b506001925050505b92915050565b634e487b7160e01b5f52604160045260245ffd5b6040516080810167ffffffffffffffff8111828210171561054c5761054c610515565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561057b5761057b610515565b604052919050565b803560208110610591575f80fd5b919050565b5f82601f8301126105a5575f80fd5b813567ffffffffffffffff8111156105bf576105bf610515565b6105d2601f8201601f1916602001610552565b8181528460208386010111156105e6575f80fd5b816020850160208301375f918101602001919091529392505050565b5f6020808385031215610613575f80fd5b823567ffffffffffffffff8082111561062a575f80fd5b818501915085601f83011261063d575f80fd5b81358181111561064f5761064f610515565b8060051b61065e858201610552565b9182528381018501918581019089841115610677575f80fd5b86860192505b8383101561072857823585811115610694575f8081fd5b86016080818c03601f19018113156106ab575f8081fd5b6106b3610529565b8983013560ff811681146106c6575f8081fd5b8152604083810135600781106106db575f8081fd5b828c015260606106ec858201610583565b83830152928401359289841115610704575f91508182fd5b6107128f8d86880101610596565b908301525084525050918601919086019061067d565b9998505050505050505050565b5f6020808352835180828501525f5b8181101561076057858101830151858201604001528201610744565b505f604082860101526040601f19601f8301168501019250505092915050565b634e487b7160e01b5f52601160045260245ffd5b808202811582820484141761050f5761050f610780565b8082018082111561050f5761050f610780565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52602160045260245ffd5b5f600182016107f7576107f7610780565b5060010190565b8051602080830151919081101561081e575f198160200360031b1b821691505b5091905056fea2646970667358221220846602d30c03a74612cec2230aa80d825d1a1f351c7e8939c0c2ec81a32434a064736f6c63430008150033";

type PackerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PackerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Packer__factory extends ContractFactory {
  constructor(...args: PackerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Packer> {
    return super.deploy(overrides || {}) as Promise<Packer>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Packer {
    return super.attach(address) as Packer;
  }
  override connect(signer: Signer): Packer__factory {
    return super.connect(signer) as Packer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PackerInterface {
    return new utils.Interface(_abi) as PackerInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Packer {
    return new Contract(address, _abi, signerOrProvider) as Packer;
  }
}
