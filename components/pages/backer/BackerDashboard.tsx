import { useRouter } from "next/navigation";
import { useWallet } from "@/components/contexts/wallet/WalletContext";
import { useCampaign } from "@/components/contexts/campaign/CampaignContext";
import { handleError } from "@/components/utils";

import CampaignCard from "@/components/campaign/CampaignCard";
import InputCampaignId from "@/components/campaign/InputCampaignId";
import ButtonRefundCampaign from "@/components/buttons/campaign/ButtonRefundCampaign";
import ButtonSupportCampaign from "@/components/buttons/campaign/ButtonSupportCampaign";

export default function BackerDashboard() {
  const router = useRouter();
  const [{ address }] = useWallet();
  const [campaign, processCampaign] = useCampaign();
  if (!campaign || campaign.CampaignInfo.data.creator.address === address)
    return (
      <InputCampaignId
        onSuccess={(campaign) => {
          processCampaign({ actionType: "Store", nextState: campaign });
          if (campaign.CampaignInfo.data.creator.address === address) router.push("/creator");
        }}
        onError={handleError}
      />
    );

  const { CampaignInfo } = campaign;
  return (
    <CampaignCard
      campaign={campaign}
      hasActions={true}
      actionButtons={
        <>
          {CampaignInfo.data.state === "Running" ? (
            // Goal not reached yet? Creator can cancel the campaign:
            <ButtonSupportCampaign
              campaign={campaign}
              onSuccess={(campaign) => processCampaign({ actionType: "Store", nextState: campaign })}
              onError={handleError}
            />
          ) : (
            // Goal reached? Creator may finish the campaign, even earlier than the deadline:
            <ButtonRefundCampaign
              campaign={campaign}
              onSuccess={(campaign) => processCampaign({ actionType: "Store", nextState: campaign })}
              onError={handleError}
            />
          )}
        </>
      }
    />
  );
}