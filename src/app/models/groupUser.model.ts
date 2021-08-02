import { User } from "./user.model";

export class GroupUser {
  constructor(
    public id: number,
    public groupModerator: boolean,
    public moderatorRequest: boolean,
    public groupRequest: boolean,
    public user: User
  ) {}

}
