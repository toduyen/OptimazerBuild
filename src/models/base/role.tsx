import { User } from "./user";

export interface Role {
  id: number;
  name: string;
  users: Array<User>;
}
