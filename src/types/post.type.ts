import { UserType } from "./user.type";

export type PostType = {
  id: string;
  title: string;
  thumbnail?: string;
  content?: string;
  description?: string;
  published: boolean;
  authorId: string;
  author?: UserType;
  category?: string;
  origin_post?: string;
  total_views: number;
  createdAt: string;
  updatedAt: string;
};
