export type TBaseGroup = {
  id: string;
  createdAt: Date;
  name: string;
  title: string;
  userIds: string[];
  amountType?: EAmountType;
  dueDate?: Date | null;
  amount?: number;
};

export type TCreateGroup = Omit<TBaseGroup, "id" | "createdAt">;

export enum EAmountType {
  FIXED = "fixed",
  FLEX = "flex",
  ANY = "any",
}
