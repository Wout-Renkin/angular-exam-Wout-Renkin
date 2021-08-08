import { User } from "./user.model";

export class Like {
  constructor(
      public likeId: number,
      public userId: number,
      public user: User,
      public postId: number,
      ) {}
}
