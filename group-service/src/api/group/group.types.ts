export type TBaseGroup = {
  id: string;
  createdAt: Date;
  ownerUserId: string;
  name: string;
  title: string;
  members: TMemberAmountTransfer[];
  balance: number;
};

export type TCreateGroup = Omit<TBaseGroup, "id" | "createdAt" | "balance">;

export type TMemberAmountTransfer = {
  userId: string;
  amount: number | null;
};

export type TUpdateGroupMembers = {
  id: string;
  members: [];
};

export type TTransferAmount = Pick<TBaseGroup, "id"> & {
  senderId: string;
  amount: number;
};
