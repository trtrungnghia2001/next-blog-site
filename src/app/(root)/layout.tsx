import WrapperComponent from "@/components/layout/WrapperComponent";
import React, { Suspense } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense>
      <WrapperComponent className="py-10">{children}</WrapperComponent>
    </Suspense>
  );
};

export default Layout;
