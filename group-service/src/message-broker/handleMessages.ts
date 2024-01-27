import GroupService from "../api/group/group.service";
import rabbitMQService from "./rabbitMQService";

export const handleRabbitMQMessage = async () => {
  rabbitMQService.subscribe(
    "group:update:memberAmountAndBalance",
    async ({ senderId, receiverId, amount }) => {
      await GroupService.updateMemberTransferAmount(
        senderId,
        receiverId,
        amount
      );
    }
  );

  rabbitMQService.subscribe("group:update:balance", async ({ groupId }) => {
    await GroupService.withdrawBalance(groupId);
  });
};
