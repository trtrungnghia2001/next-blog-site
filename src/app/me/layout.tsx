"use client";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { auth_links } from "@/constants/link.constant";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathName = usePathname();
  return (
    <Suspense>
      <WrapperComponent className="py-10 flex items-start gap-10">
        {/* sidebar */}
        <div className="hidden md:block max-w-[200px] xl:max-w-[250px] w-full ">
          <ul className="space-y-2">
            {auth_links.map((item) => (
              <li key={item.name}>
                <Link
                  href={`/me` + item.href}
                  className={clsx([
                    `flex items-center gap-3 w-full px-3 py-1.5 rounded-lg hover:bg-box-bg`,
                    pathName.includes(item.href) ? `bg-box-bg` : ``,
                  ])}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* main */}
        <div className="flex-1 space-y-6 overflow-hidden">
          <h5>
            {auth_links.find((item) => pathName.includes(item.href))?.name}
          </h5>
          <div>{children}</div>
        </div>
      </WrapperComponent>
    </Suspense>
  );
};

export default Layout;
