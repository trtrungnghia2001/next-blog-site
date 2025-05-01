import {
  createPost,
  deletePostById,
  getPostByMe,
  updatePostById,
} from "@/services/query";
import { PostType } from "@/types/post.type";
import { StoreType } from "@/types/type";
import { create } from "zustand";

export const usePostStore = create<StoreType<PostType>>()((set, get) => ({
  data: [],
  getAll: async (params) => {
    const resp = await getPostByMe(params);
    set({ data: resp.results });
    return resp;
  },
  create: async (data) => {
    const resp = (await createPost(data)) as unknown as PostType;
    set({ data: [resp, ...get().data] });
  },
  updateById: async (id, data) => {
    const resp = (await updatePostById(id, data)) as unknown as PostType;
    set({
      data: get().data.map((item) =>
        item.id === id ? { ...item, ...resp } : item
      ),
    });
  },
  deleteById: async (id) => {
    const resp = (await deletePostById(id)) as unknown as PostType;
    set({
      data: get().data.filter((item) => item.id !== resp.id),
    });
  },
}));
