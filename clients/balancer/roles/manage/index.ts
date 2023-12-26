import { formatBytes32String } from "ethers/lib/utils";
import permissions from "./permissions";

export { permissions };

export const roleKey = formatBytes32String("manage");

export const members = ["0x60716991aCDA9E990bFB3b1224f1f0fB81538267"];