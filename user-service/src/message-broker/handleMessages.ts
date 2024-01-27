import UserService from "../api/users/user.service";
import rabbitMQService from "./rabbitMQService";

export const handleRabbitMQMessage = async () => {
  await rabbitMQService.connect();

  rabbitMQService.subscribe(
    "user:update:groupIds",
    async ({ groupId, members }) => {
      await UserService.updateUserGroupIds(groupId, members);
    }
  );

  rabbitMQService.subscribe(
    "user:update:balance",
    async (transactionDetails) => {
      await UserService.updateUserBalance(transactionDetails);
    }
  );
};
