import { formatBytes32String } from "ethers/lib/utils";
import permissions from "./permissions";

export { permissions };

export const roleKey = formatBytes32String("manage");

export const members = ["0xf423f27FAe9dDd0ee0d50cbC11B94c99DcB347A9"];