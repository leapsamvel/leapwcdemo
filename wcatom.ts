import { atom, selectorFamily } from "recoil";

export const Web3WalletInitState = atom<boolean>({
    key: "web3WalletInit",
    default: false,
    dangerouslyAllowMutability: true,
});