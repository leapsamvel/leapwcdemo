export const COSMOS_SIGN_AMINO = "cosmos_signAmino";
export const COSMOS_SIGN_DIRECT = "cosmos_signDirect";
export const COSMOS_GET_ACCOUNTS = "cosmos_getAccounts";

export const CosmosMethods = [
  COSMOS_SIGN_AMINO,
  COSMOS_SIGN_DIRECT,
  COSMOS_GET_ACCOUNTS,
  "keplr_getKey",
];
export const CosmosEvents = ["accountsChanged", "chainChanged"];

export const WC_METADATA = {
  description:
    "Leap Wallet is the simplest & safest way to store, send, swap and stake tokens on Cosmos blockchains.",
  url: "https://leapwallet.io/",
  icons: ["https://assets.leapwallet.io/logos/leap-cosmos-logo.png"],
  name: "Leap Cosmos Wallet",
};
