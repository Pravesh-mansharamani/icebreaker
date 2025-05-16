"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoogleViaTipLinkWalletName } from "@tiplink/wallet-adapter";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { TipLinkWalletModal } from "@tiplink/wallet-adapter-react-ui";
import { generateSigningMessage } from "@aptos-labs/ts-sdk";
import {EphemeralKeyPair} from '@aptos-labs/ts-sdk';

export default function AccountModal() {
  const { select, connect, connected, connecting, publicKey } = useWallet();
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {

    try {
      if (!connected && !connecting) {
        select(GoogleViaTipLinkWalletName);
        await connect();           // opens TipLink modal → Google OAuth
      }

      if (connected && publicKey) {
        const gameRecord = new Uint8Array(Date.now());
        await signMessage(gameRecord);
      }
      // 2. Do your sharing logic here (sign message, post tweet, etc.)
      // ...

    } catch (err) {
      console.error("TipLink connection failed:", err);
    }
  }, [select, connect, connected, connecting]);

  return (
    <Button
      className="w-full gap-2 bg-primary text-black cyber-font hover:bg-primary/80"
      onClick={handleShare}
      disabled={shared || connecting}
    >
      <Share2 className="h-4 w-4" />
      SAVE TO ACCOUNT
    </Button>
  );
}
