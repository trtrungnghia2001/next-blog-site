import { PostType } from "./post.type";
import { UserType } from "./user.type";

export type SeriesType = {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  authorId: string;
  author: UserType;
  postId: string;
  post: PostType;
  category: string;
  total_views: number;
  postsOfSeries: {
    seriesId: string;
    postId: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
