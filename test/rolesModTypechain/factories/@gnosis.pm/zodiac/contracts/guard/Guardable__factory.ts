/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Guardable,
  GuardableInterface,
} from "../../../../../@gnosis.pm/zodiac/contracts/guard/Guardable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "guard_",
        type: "address",
      },
    ],
    name: "NotIERC165Compliant",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "ChangedGuard",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "getGuard",
    outputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "guard",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    name: "setGuard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506103bc806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063715018a6146100675780637ceab3b1146100715780638da5cb5b1461009a578063c9106389146100ab578063e19a9dd9146100bc578063f2fde38b146100cf575b600080fd5b61006f6100e2565b005b606554610084906001600160a01b031681565b6040516100919190610320565b60405180910390f35b6033546001600160a01b0316610084565b6065546001600160a01b0316610084565b61006f6100ca366004610334565b6100f6565b61006f6100dd366004610334565b6101fb565b6100ea610274565b6100f460006102ce565b565b6100fe610274565b6001600160a01b038116156101a4576040516301ffc9a760e01b815263736bd41d60e11b60048201526001600160a01b038216906301ffc9a790602401602060405180830381865afa158015610158573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017c9190610364565b6101a457806040516358b7533f60e11b815260040161019b9190610320565b60405180910390fd5b606580546001600160a01b0319166001600160a01b0383169081179091556040517f1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa2916101f091610320565b60405180910390a150565b610203610274565b6001600160a01b0381166102685760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161019b565b610271816102ce565b50565b6033546001600160a01b031633146100f45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161019b565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0391909116815260200190565b60006020828403121561034657600080fd5b81356001600160a01b038116811461035d57600080fd5b9392505050565b60006020828403121561037657600080fd5b8151801515811461035d57600080fdfea264697066735822122047c84859c0bd90df82833d261870294e6a6aa4ab302ee84f9bb56333c71d4eb764736f6c63430008110033";

type GuardableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GuardableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Guardable__factory extends ContractFactory {
  constructor(...args: GuardableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Guardable> {
    return super.deploy(overrides || {}) as Promise<Guardable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Guardable {
    return super.attach(address) as Guardable;
  }
  override connect(signer: Signer): Guardable__factory {
    return super.connect(signer) as Guardable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GuardableInterface {
    return new utils.Interface(_abi) as GuardableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Guardable {
    return new Contract(address, _abi, signerOrProvider) as Guardable;
  }
}
