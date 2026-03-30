"use client";

import { ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from "@initia/interwovenkit-react";
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js";

const queryClient = new QueryClient();

// Wagmi config with Initia's Privy connector
const config = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

interface EthereumWalletProviderProps {
  children: ReactNode;
}

export function EthereumWalletProvider({ children }: EthereumWalletProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    injectStyles(InterwovenKitStyles);
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <InterwovenKitProvider
          {...TESTNET}
          theme="dark"
          enableAutoSign={{
            // Allow auto-signing for MiniEVM contract calls (agent transactions)
            "initiation-2": ["/minievm.evm.v1.MsgCall"],
          }}
        >
          {mounted ? children : null}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
