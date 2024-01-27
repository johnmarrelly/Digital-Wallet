import { TBaseGroup, TMemberAmountTransfer } from "./group.types";

export class GetGroupDTO {
  id: string;
  createdAt: Date;
  name: string;
  title: string;
  members: TMemberAmountTransfer[];

  constructor(props: TBaseGroup) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.name = props.name;
    this.title = props.title;
    this.members = props?.members ?? [];
  }
}
