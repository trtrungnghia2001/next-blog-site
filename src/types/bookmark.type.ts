import { PostType } from "./post.type";
import { UserType } from "./user.type";

export type BookmarkType = {
  id: string;
  authorId: string;
  author: UserType;
  postId: string;
  post: PostType;
};
