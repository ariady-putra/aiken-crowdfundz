import { useEffect, useState } from "react";
import { useWallet } from "@/components/contexts/wallet/WalletContext";
import { handleError } from "@/components/utils";

import { Spinner } from "@nextui-org/spinner";
import { Snippet } from "@nextui-org/snippet";
import { Button } from "@nextui-org/button";

import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
import { Wallet } from "@/types/cardano";
import { Skeleton } from "@nextui-org/skeleton";

export default function WalletConnectors() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { lucid } = walletConnection;

  const [wallets, setWallets] = useState<Wallet[]>();

  let isInit = false;
  useEffect(() => {
    if (isInit) return;
    else isInit = true;

    const wallets: Wallet[] = [];

    const { cardano } = window;
    for (const c in cardano) {
      const wallet = cardano[c];
      if (!wallet.apiVersion) continue;
      wallets.push(wallet);
    }

    wallets.sort((l, r) => {
      return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
    });
    setWallets(wallets);
  }, []);

  async function onConnectWallet(wallet: Wallet) {
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";

      const api = await wallet.enable();
      lucid.selectWallet.fromAPI(api);

      const address = await lucid.wallet().address();
      const pkh = paymentCredentialOf(address).hash;

      const stakeAddress = (await lucid.wallet().rewardAddress()) ?? "";
      const skh = stakeAddress ? stakeCredentialOf(stakeAddress).hash : "";

      setWalletConnection((walletConnection) => {
        return { ...walletConnection, wallet, address, pkh, stakeAddress, skh };
      });
    } catch (error) {
      handleError(error);
    }
  }

  if (!wallets)
    return (
      <Snippet hideCopyButton hideSymbol variant="bordered">
        <Spinner label="Browsing Cardano Wallets" />
      </Snippet>
    );

  if (!wallets.length)
    return (
      <Snippet hideCopyButton hideSymbol variant="bordered">
        <p className="uppercase">No Cardano Wallet</p>
      </Snippet>
    );

  return (
    <div className="flex flex-col gap-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6">
      {wallets.map((wallet, w) => (
        <Skeleton key={`wallet.${w}`} isLoaded={!!lucid} className="rounded-full">
          <Button onPress={() => onConnectWallet(wallet)} color="primary" radius="full" variant="shadow" className="capitalize" fullWidth>
            {wallet.name}
          </Button>
        </Skeleton>
      ))}
    </div>
  );
}
