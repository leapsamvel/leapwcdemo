import { useCallback, useEffect, useState } from "react";
import {
  createWeb3Wallet,
} from "./web3Wallet";
import { useRecoilState } from "recoil";
import { Web3WalletInitState } from "./wcatom";

export default function useInitialization() {
  const [initialized, setInitialized] = useRecoilState(Web3WalletInitState);

  const onInitialize = useCallback(async () => {
    try {
      await createWeb3Wallet();
      setInitialized(true);
    } catch (err: unknown) {
      console.log("Error for initializing retrying", err);
    }
  }, [setInitialized]);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}
