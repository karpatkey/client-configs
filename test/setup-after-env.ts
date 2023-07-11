import { parseBytes32String } from "ethers/lib/utils";
import { Roles__factory } from "./rolesModTypechain";
import { revertToBase } from "./snapshot";
import { Status } from "./types";
import { BigNumber } from "ethers";

global.afterAll(revertToBase);

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAllowed(): CustomMatcherResult;
      toBeForbidden(status?: Status, info?: string): CustomMatcherResult;
    }
  }
}

expect.extend({
  async toBeAllowed(received: Promise<any>) {
    try {
      const res = await received;
      return {
        message: () => `Expected transaction ${this.utils.stringify(decodeUnwrappedTransaction(res))} to not be allowed, but it is`,
        pass: true,
      };
    } catch (error: any) {
      if (typeof error !== "object" || error.code !== "CALL_EXCEPTION") {
        throw error;
      }

      if (!error.errorSignature) {
        // if we get here, it's not a permission error
        return {
          message: () => `Expected transaction ${this.utils.stringify(
            decodeUnwrappedTransaction(error.transaction),
          )} to not be allowed, but it is`,
          pass: true,
        };
      }

      if (error.errorSignature !== "ConditionViolation(uint8,bytes32)") {
        throw error;
      }

      const receivedStatus = error.errorArgs.status;

      return {
        message: () =>
          `Expected transaction ${this.utils.stringify(
            decodeUnwrappedTransaction(error.transaction),
          )} to be allowed, but it is forbidden with status ${this.utils.printReceived(
            Status[receivedStatus],
          )}`,
        pass: false,
      };
    }
  },

  async toBeForbidden(received: Promise<any>, status?: Status, info?: string) {
    try {
      const res = await received;
      return {
        message: () => `Expected transaction  ${this.utils.stringify(decodeUnwrappedTransaction(res))} to be forbidden but it passed`,
        pass: false,
      };
    } catch (error: any) {
      if (typeof error !== "object" || error.code !== "CALL_EXCEPTION") {
        throw error;
      }

      if (!error.errorSignature) {
        // if we get here, it's not a permission error
        return {
          message: () => `Expected transaction ${this.utils.stringify(
            decodeUnwrappedTransaction(error.transaction),
          )} to be forbidden but it passed`,
          pass: false,
        };
      }

      if (error.errorSignature !== "ConditionViolation(uint8,bytes32)") {
        throw error;
      }

      const receivedStatus = error.errorArgs.status;
      const receivedInfo = error.errorArgs.info;

      if (status !== undefined) {
        if (receivedStatus !== status) {
          return {
            message: () =>
              `Expected transaction ${this.utils.stringify(
                decodeUnwrappedTransaction(error.transaction),
              )} to be forbidden with status ${this.utils.printExpected(
                Status[status],
              )} but status is ${this.utils.printReceived(
                Status[receivedStatus],
              )}`,
            pass: false,
          };
        }
      }

      if (info) {
        if (receivedInfo !== info) {
          return {
            message: () =>
              `Expected transaction ${this.utils.stringify(
                decodeUnwrappedTransaction(error.transaction),
              )} to be forbidden with info ${this.utils.printExpected(
                info,
              )} but info is ${this.utils.printReceived(receivedInfo)}`,
            pass: false,
          };
        } else {
          return {
            message: () =>
              `Expected transaction ${this.utils.stringify(
                decodeUnwrappedTransaction(error.transaction),
              )} to be forbidden with info ${this.utils.printExpected(
                info,
              )} but it did`,
            pass: true,
          };
        }
      }

      let details = "";
      if (status !== undefined)
        details += ` with status ${this.utils.printExpected(Status[status])}`;
      if (info !== undefined)
        details += ` (info: ${this.utils.printExpected(info)})`;

      return {
        message: () =>
          `Expected transaction ${this.utils.stringify(
            decodeUnwrappedTransaction(error.transaction),
          )} to not be forbidden${details}, but it was`,
        pass: true,
      };
    }
  },
});

const decodeUnwrappedTransaction = ({ data, from }: {data: string, from: string}) => {
  const [to, value, metaTxData, operation, roleKey] = Roles__factory.createInterface().decodeFunctionData('execTransactionWithRole', data)
  return { to, value: BigNumber.from(value).toString(), data: metaTxData, operation, from, role: parseBytes32String(roleKey) }
}