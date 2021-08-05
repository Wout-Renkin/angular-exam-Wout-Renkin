import { Post } from "./post.model";
import { User } from "./user.model";

export class Comment {
  constructor(
      public commentId: number,
      public body: string,
      public userId: User,
      public user: User,
      public postId: number,
      public post: Post,
      ) {}
}
