import { Group } from "./group.model";
import { User } from "./user.model";

export class GroupUser {
  constructor(
    public id: number,
    public groupModerator: boolean,
    public moderatorRequest: boolean,
    public groupRequest: boolean,
    public userId: number,
    public group: Group,
    public user: User
  ) {}

}
