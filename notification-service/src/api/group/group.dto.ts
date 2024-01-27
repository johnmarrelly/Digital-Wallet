import { EAmountType, TBaseGroup } from "./group.types";

export class GetGroupDTO {
  id: string;
  createdAt: Date;
  name: string;
  title: string;
  userIds: string[] | [];
  amount: number | [];
  dueDate: Date | null;
  amountType: EAmountType;

  constructor(props: TBaseGroup) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.name = props.name;
    this.title = props.title;
    this.userIds = props?.userIds ?? [];
    this.amount = props?.amount ?? 0;
    this.dueDate = props?.dueDate ?? null;
  }
}
