import { useCampaign } from "../contexts/campaign/CampaignContext";
import { useWallet } from "../contexts/wallet/WalletContext";
import { Button } from "@nextui-org/button";

export default function DisconnectButton() {
  const [walletConnection, setWalletConnection] = useWallet();
  const [, processCampaign] = useCampaign();

  function disconnect() {
    processCampaign({ actionType: "Clear" });
    setWalletConnection((walletConnection) => {
      return { ...walletConnection, wallet: undefined, address: "", pkh: "", stakeAddress: "", skh: "" };
    });
  }

  return (
    <Button onPress={disconnect} className="absolute top-0 right-0 -translate-y-full">
      Disconnect
    </Button>
  );
}
