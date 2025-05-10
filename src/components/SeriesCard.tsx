import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { IMAGE_FOUND } from "@/constants/image.constant";
import { SeriesType } from "@/types/series.type";

const SeriesCard = ({ data }: { data: SeriesType }) => {
  return (
    <div className="border rounded-lg overflow-hidden group">
      <Link
        href={`/series/` + data.id}
        className="relative w-full aspect-video block overflow-hidden"
      >
        <Image
          src={data.thumbnail || IMAGE_FOUND.post_found}
          alt="thumbnail"
          fill
          className="image group-hover:scale-110 transition-all duration-300"
        />
      </Link>
      <div className="p-3 space-y-3">
        <div className="text-xs text-text-color-2 flex items-center gap-2">
          <Link
            href={`/category/` + data.category}
            className="px-1.5 py-1.5 inline-block rounded-full text-blue-500 bg-blue-100 font-medium leading-none capitalize"
          >
            {data.category}
          </Link>
        </div>
        <h5>
          <Link href={`/series/` + data.id} className="line-clamp-2 h-12">
            {data.title}
          </Link>
        </h5>
        <Link
          href={`/author/` + data.author?.id}
          className="flex items-center gap-2"
        >
          <div className="aspect-square relative w-7 rounded-full overflow-hidden">
            <Image
              src={data.author?.avatar || IMAGE_FOUND.avatar_found}
              alt="avatar"
              fill
            />
          </div>
          <div>
            <h6 className="font-medium ">{data.author?.name}</h6>
            <div className="text-xs text-text-color-2">
              {new Date(data.createdAt).toDateString()}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default memo(SeriesCard);
