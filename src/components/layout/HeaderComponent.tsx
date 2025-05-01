"use client";
import Link from "next/link";
import React, { memo, useState } from "react";
import WrapperComponent from "./WrapperComponent";
import { auth_links, header_links } from "@/constants/link.constant";
import InputSearchComponent from "./InputSearchComponent";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import ToggleTheme from "../ToggleTheme";
import { Grip, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import clsx from "clsx";

const HeaderComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [qValue, setQValue] = useState("");

  const { signin, signout } = useUserStore();
  const { user } = useUser();
  React.useEffect(() => {
    (async function () {
      if (user) {
        await signin();
      } else {
        await signout();
      }
    })();
  }, [user]);

  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <header className="shadow">
        <WrapperComponent>
          <div className="flex items-center justify-between py-4">
            <div>
              <Link
                href={`/`}
                className="relative w-32 h-8 inline-block font-bold text-xl"
              >
                Blog
              </Link>
            </div>
            <div className="hidden xl:block">
              <ul className="flex items-center gap-8">
                {header_links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <InputSearchComponent
                className="hidden md:block text-"
                value={qValue}
                onChange={(e) => setQValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/search?q=` + qValue);
                  }
                }}
              />
              <button
                className="md:hidden"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} />
              </button>
              <ToggleTheme />
              <SignedOut>
                <SignInButton>
                  <Button size={"sm"}>Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
                <Link href={`/me/dashboard`} className="hidden md:block">
                  <Button size={"sm"} className="text-xs">
                    Dashboard
                  </Button>
                </Link>
              </SignedIn>
              <button
                className="block xl:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Grip />
              </button>
            </div>
          </div>
          <InputSearchComponent
            className={showSearch ? `block ` : `hidden`}
            value={qValue}
            onChange={(e) => setQValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/search?q=` + qValue);
              }
            }}
          />
        </WrapperComponent>
      </header>
      {/* sidebar */}
      <Sheet open={showSidebar} onOpenChange={() => setShowSidebar(false)}>
        <SheetContent side="left" className="p-4 space-y-2">
          <SheetHeader className="p-0">
            <SheetTitle>
              <Link
                href={`/`}
                onClick={() => setShowSidebar(false)}
                className="inline-block text-text-color text-xl"
              >
                Blog
              </Link>
            </SheetTitle>
          </SheetHeader>
          <ul className="space-y-3">
            {header_links
              .filter((item) => item.href !== "/")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      pathName.includes(item.href) ? `text-blue-500` : ``
                    }
                    onClick={() => setShowSidebar(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
          <ul className="space-y-3">
            {auth_links.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/me/` + item.href}
                  className={clsx([
                    `flex items-center gap-3`,
                    pathName.includes(item.href) ? `text-blue-500` : ``,
                  ])}
                  onClick={() => setShowSidebar(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default memo(HeaderComponent);
