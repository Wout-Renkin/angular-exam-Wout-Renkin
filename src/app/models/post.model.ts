import { Company } from "./company.model";
import { Group } from "./group.model";
import { Like } from "./like.model";
import { User } from "./user.model";
import { Comment } from "./comment.model";

export class Post {
  constructor(
      public postId: number,
      public title: string,
      public imagePath: string,
      public body: string,
      public userId: number,
      public user: User,
      public companyId: number,
      public company: Company,
      public groupId: number,
      public Group: Group,
      public comments: Comment[],
      public likes: Like[],

      ) {}
}
