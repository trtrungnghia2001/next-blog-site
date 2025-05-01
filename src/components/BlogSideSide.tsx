import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { PostType } from "@/types/post.type";
import { IMAGE_FOUND } from "@/constants/image.constant";

const BlogSideSide = ({ data }: { data: PostType }) => {
  return (
    <div className="border rounded-lg overflow-hidden relative">
      <Link
        href={`/blog/` + data.id}
        className="relative w-full aspect-video block"
      >
        <Image
          src={data.thumbnail || IMAGE_FOUND.post_found}
          alt="thumbnail"
          fill
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 text-white p-3 space-y-3">
        <div className="text-xs text-text-color-2 flex items-center gap-2">
          <Link
            href={`/category/` + data.category}
            className="px-1.5 py-1.5 inline-block rounded-full bg-blue-500 text-white font-medium leading-none capitalize"
          >
            {data.category}
          </Link>
        </div>
        <h5 className="line-clamp-2">{data.title}</h5>
        <Link
          href={`/author/` + data.author?.id}
          className="flex items-center gap-2"
        >
          <div className="aspect-square relative w-5 rounded-full overflow-hidden">
            <Image
              src={data.author?.avatar || IMAGE_FOUND.avatar_found}
              alt="avatar"
              fill
            />
          </div>
          <h6 className="font-medium">{data.author?.name}</h6>
          <span className="text-xs">
            {new Date(data.createdAt).toDateString()}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default memo(BlogSideSide);
