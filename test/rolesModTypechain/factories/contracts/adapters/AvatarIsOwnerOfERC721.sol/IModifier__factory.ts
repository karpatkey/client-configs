/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IModifier,
  IModifierInterface,
} from "../../../../contracts/adapters/AvatarIsOwnerOfERC721.sol/IModifier";

const _abi = [
  {
    inputs: [],
    name: "avatar",
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
    name: "target",
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
] as const;

export class IModifier__factory {
  static readonly abi = _abi;
  static createInterface(): IModifierInterface {
    return new utils.Interface(_abi) as IModifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IModifier {
    return new Contract(address, _abi, signerOrProvider) as IModifier;
  }
}