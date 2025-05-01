export type UserType = {
  id: string;
  name: string;
  userId: string;
  avatar?: string;
  description?: string;
  job: string;
  link_facebook: string;
  link_twitter: string;
  link_instagram: string;
  link_youtube: string;
  link_github: string;

  createdAt: string;
  updatedAt: string;
};

export type UserStore = {
  user: UserType | null;
  getMe: () => void;
  updateMe: (data: UserType) => void;
  changePassword: (data: PasswordType) => void;
  signin: () => void;
  signout: () => void;
};

export type PasswordType = {
  password: string;
  confirm_password: string;
};
