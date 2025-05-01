import { Search } from "lucide-react";
import React, { ComponentProps, FC, memo } from "react";

const InputSearchComponent: FC<ComponentProps<"input">> = ({ ...props }) => {
  return (
    <div {...props}>
      <div className="flex items-center pr-2 rounded-full bg-control-bg text-13 w-full">
        <input
          type="text"
          className="bg-transparent px-3 py-1.5 border-none outline-none w-full"
          placeholder="Search..."
        />
        <Search size={14} />
      </div>
    </div>
  );
};

export default memo(InputSearchComponent);
