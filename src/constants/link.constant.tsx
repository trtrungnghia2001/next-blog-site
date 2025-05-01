import {
  Bookmark,
  LayoutDashboard,
  Lock,
  Newspaper,
  ScrollText,
  User,
} from "lucide-react";

export const header_links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Series",
    href: "/series",
  },
  // {
  //   name: "About",
  //   href: "/about",
  // },
  // {
  //   name: "Contact",
  //   href: "/contact",
  // },
];

export const footer_links = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    name: "Terms of Service",
    href: "/terms-of-service",
  },
  {
    name: "Contact Us",
    href: "/contact-us",
  },
];

export const auth_links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    name: "Update Me",
    href: "/update-me",
    icon: <User size={16} />,
  },
  {
    name: "Change Password",
    href: "/change-password",
    icon: <Lock size={16} />,
  },
  {
    name: "Blogs",
    href: "/blogs",
    icon: <Newspaper size={16} />,
  },
  {
    name: "Series",
    href: "/series",
    icon: <ScrollText size={16} />,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: <Bookmark size={16} />,
  },
];
