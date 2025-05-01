import { changePassword, getMe, updateMe } from "@/services/query";
import { UserStore, UserType } from "@/types/user.type";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        getMe: async () => {
          const resp = await getMe();
          set({
            user: resp as unknown as UserType,
          });
        },
        signin: async () => {
          const resp = await getMe();
          set({
            user: resp as unknown as UserType,
          });
        },
        signout: async () => {
          set({
            user: null,
          });
        },
        updateMe: async (data) => {
          const resp = await updateMe(data);
          set({
            user: resp as unknown as UserType,
          });
        },
        changePassword: async (data) => {
          if (data.confirm_password !== data.password) {
            throw new Error(`Wrong password!`);
          }
          await changePassword(data.password);
        },
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
