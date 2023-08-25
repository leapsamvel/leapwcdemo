import { useCallback, useEffect } from "react";
import {
  COSMOS_GET_ACCOUNTS,
  COSMOS_SIGN_AMINO,
  COSMOS_SIGN_DIRECT,
} from "./wcConstants";
import { web3wallet } from "./web3Wallet";

function validateProposalPayload(payload: any) {
  const chainId =
    payload.params.requiredNamespaces.cosmos.chains?.[0].split(":")?.[1];
  console.log(chainId)
  const chain = 'cosmoshub-4';
  return !!chain;
}

export function useInitWCV2Listeners(initialised: boolean) {
  const handleSessionProposal = useCallback(async (payload) => {
    console.log('Session Proposal', payload);
    const isValidPayload = validateProposalPayload(payload);
    if (isValidPayload) {
      await web3wallet?.approveSession({
        id: payload.id,
        namespaces: {
          cosmos: {
            accounts: ["cosmos:cosmoshub-4:cosmos1laj8fjmxqymyknhuhggg52fxpuyrhw90nu7wqa"],
            methods: payload.params.requiredNamespaces.cosmos.methods,
            events: payload.params.requiredNamespaces.cosmos.events,
          },
        },
      });
    } else {
      web3wallet.rejectSession({
        id: payload.id,
        reason: {
          code: 1,
          message: "Invalid chainId",
        },
      });

    }
  }, []);

  const handleSessionRequest = useCallback(
    async (payload) => {
      console.log('Session request', payload);
      const sessions = web3wallet.getActiveSessions();
      const requestedTopic = Object.keys(sessions).find(
        (topic) => topic === payload.topic
      );
      if (!requestedTopic) {
        return;
      }

      const requestSession =  sessions[requestedTopic];

      const peerMeta = {
        name: requestSession.peer.metadata.name,
        url: requestSession.peer.metadata.url,
        icons: requestSession.peer.metadata.icons,
        description: requestSession.peer.metadata.description,
      };

      if (payload?.params?.request?.method === COSMOS_SIGN_AMINO) {
        // navigation.navigate("TransactionRequest", {
        //   id: payload.id,
        //   params: payload?.params?.request?.params,
        //   handshakeTopic: payload.topic,
        //   wcv2: true,
        //   peerMeta,
        //   chainId: payload.params.chainId.split(":")[1],
        // });
      } else if (payload?.params?.request?.method === COSMOS_SIGN_DIRECT) {
        // navigation.navigate("TransactionRequest", {
        //   id: payload.id,
        //   params: payload?.params?.request?.params,
        //   handshakeTopic: payload.topic,
        //   wcv2: true,
        //   peerMeta,
        //   method: COSMOS_SIGN_DIRECT,
        //   chainId: payload.params.chainId.split(":")[1],
        // });
      } else if (payload?.params?.request?.method === COSMOS_GET_ACCOUNTS) {
        // await web3wallet.respondSessionRequest({
        //   topic: payload.topic,
        //   response: {
        //     id: payload.id,
        //     jsonrpc: "2.0",
        //     result: [
        //       {
        //         algo: "secp256k1",
        //         address,
        //         pubkey,
        //       },
        //     ],
        //   },
        // });
      }
    },
    []
  );

  const handleSessionDelete = useCallback(async (payload) => {
     console.log('session dropped');
  }, []);

  useEffect(() => {
    console.log("Reached")
    if(!initialised) {
        console.log("Reached 2")
        web3wallet?.on("session_proposal", handleSessionProposal);
        web3wallet?.on("session_request", handleSessionRequest);
        web3wallet?.on("session_delete", handleSessionDelete);
    }

    return () => {
      if (web3wallet) {
        web3wallet?.removeListener("session_proposal", handleSessionProposal);
        web3wallet?.removeListener("session_request", handleSessionRequest);
        web3wallet?.removeListener("session_delete", handleSessionDelete);
      }
    };
  }, [
    handleSessionRequest,
    handleSessionDelete,
    handleSessionProposal,
  ]);
}
