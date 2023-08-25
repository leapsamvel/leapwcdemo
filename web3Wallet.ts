import { Core } from "@walletconnect/core";
import { ICore, SessionTypes } from "@walletconnect/types";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";
import { WC_METADATA } from "./wcConstants";

export let web3wallet: IWeb3Wallet;


// Uncomment this to use web3wallet client instead of sign client
export async function createWeb3Wallet() {
  let core = new Core({
    relayUrl: "wss://relay.walletconnect.com",
    projectId: "",
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: WC_METADATA,
  });
}