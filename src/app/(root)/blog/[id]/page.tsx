"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { IMAGE_FOUND } from "@/constants/image.constant";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getPostId, increasePost } from "@/services/query";
import { ReactNewQuillView } from "@/components/form/react-quill-editor";

import LoadingComponent from "@/components/layout/LoadingComponent";
import { useUserStore } from "@/stores/user.store";
import BlogMenu from "@/components/BlogMenu";

const Page = () => {
  const { id } = useParams();
  const { user } = useUserStore();
  const getIdResult = useQuery({
    queryKey: [`post`, id],
    queryFn: async () => getPostId(id as string),
    enabled: !!id,
  });
  useQuery({
    queryKey: [`post`, `increase`, id],
    queryFn: async () => await increasePost(id as string),
    enabled: !!(user && id),
  });

  if (getIdResult.isLoading) return <LoadingComponent />;

  return (
    <div className="max-w-[800px] w-full space-y-6 mx-auto">
      {/* category */}
      <div className="text-xs text-text-color-2 flex items-center gap-2">
        <Link
          href={`/category/` + getIdResult.data?.category}
          className="px-1.5 py-1.5 inline-block rounded-full bg-blue-500 text-white font-medium leading-none capitalize"
        >
          {getIdResult.data?.category}
        </Link>
      </div>
      {/* title */}
      <div>
        <h2>{getIdResult.data?.title}</h2>
      </div>
      {/* author */}
      <div className="flex items-center justify-between">
        <Link
          href={`/author/` + getIdResult.data?.author?.id}
          className="flex items-center gap-2"
        >
          <div className="aspect-square relative w-7 rounded-full overflow-hidden">
            <Image
              src={getIdResult.data?.author?.avatar || IMAGE_FOUND.avatar_found}
              alt="avatar"
              fill
            />
          </div>
          <div>
            <h6 className="font-medium">{getIdResult.data?.author?.name}</h6>
            <div className="text-xs text-text-color-2 space-x-2">
              <span>
                {new Date(getIdResult.data?.createdAt || "").toDateString()}
              </span>
              <span>-</span>
              <span>{getIdResult.data?.total_views} views</span>
            </div>
          </div>
        </Link>
        {user && (
          <BlogMenu
            postId={getIdResult.data?.id as string}
            isPostBookmark={
              getIdResult.data ? getIdResult.data?.bookmarks.length > 0 : false
            }
          />
        )}
      </div>
      {/* content */}
      {getIdResult.data?.content && (
        <div
          className="bg-box-bg p-3 rounded-lg italic whitespace-break-spaces"
          dangerouslySetInnerHTML={{ __html: getIdResult.data?.content }}
        ></div>
      )}
      {/* thumbnail */}
      {getIdResult.data?.thumbnail && (
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image src={getIdResult.data?.thumbnail} alt="thumbnail" fill />
        </div>
      )}
      {/* description */}
      <ReactNewQuillView content={getIdResult.data?.description || ""} />
      {/* origin_post */}
      {getIdResult.data?.origin_post && (
        <div>
          <span>Origin: </span>
          <Link
            href={getIdResult.data?.origin_post}
            className="underline text-blue-500"
          >
            {getIdResult.data?.origin_post}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
