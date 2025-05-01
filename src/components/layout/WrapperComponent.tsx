import clsx from "clsx";
import React, { ComponentProps, FC, memo } from "react";

const WrapperComponent: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx([`max-w-6xl w-full mx-auto px-3`, className])}
      {...props}
    />
  );
};

export default memo(WrapperComponent);
