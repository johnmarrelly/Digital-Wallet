export type TBaseUser = {
  id: string;
  createdAt: Date;
  idCardNumber: string;
  creditCardNumber: string;
  name: string;
  email: string;
  groupIds: string[];
  balance: number;
};

export type TGetUserByFieldProps = Partial<Pick<TBaseUser, "id">>;

export type TCreateUser = Omit<
  TBaseUser,
  "id" | "createdAt" | "balance" | "groupIds"
>;

export type TUpdateUserBalance = {
  userId: string;
  amount: number;
};

export enum EEntityType {
  GROUP = "group",
  INDIVIDUAL = "individual",
}
