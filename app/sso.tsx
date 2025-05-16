"use client";

import "@tiplink/wallet-adapter-react-ui/styles.css"; // keep modal styles
import { ReactNode, useEffect, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react"
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  TipLinkWalletAutoConnectV2,
  DefaultTipLinkWalletModalProvider,
  TipLinkLoginButton,
  TipLinkWalletModal,
} from '@tiplink/wallet-adapter-react-ui';
import { useRouter } from "next/compat/router";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import { EphemeralKeyPair, EphemeralPublicKey } from "@aptos-labs/ts-sdk";


/**
 * Helper: throws at build/runtime if the env-var is missing,
 * so TypeScript no longer sees `string | undefined`.
 */
function requiredEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

type Props = { children: ReactNode };

export default function AccountProvider({ children }: Props) {
  // Use Tiplink Google SSO with Solana wallet as scaffold
  const accountAdapter = new TipLinkWalletAdapter({
    title: "Icebreaker",                       
    clientId: "c5c0836c-e9c7-4166-8007-6dfe493bfd8f", 
    theme: "dark",              
  });

  const wallets = useMemo(
    () => [
      accountAdapter
    ],
    []
  );


  const checkNonce = () => {
    // decodes jwt
  }

  const factorNonce = () => {
    !!checkNonce;
    return EphemeralKeyPair.generate().nonce;
  }

  accountAdapter.addListener("connect", factorNonce) 

  accountAdapter.addListener("readyStateChange", checkNonce) 

  return (
    <ConnectionProvider endpoint={""}>
      {/* Auto-connect restores previous session seamlessly */}
      <TipLinkWalletAutoConnectV2 isReady
          query={searchParams}>
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
        </WalletProvider>
        </TipLinkWalletAutoConnectV2>
    </ConnectionProvider>
  );
}
