import { TBaseUser } from "./user.types";

export class GetUserDTO {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  idCardNumber: string;
  balance: number;

  constructor(props: TBaseUser) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.name = props.name;
    this.balance = props.balance;
  }
}
