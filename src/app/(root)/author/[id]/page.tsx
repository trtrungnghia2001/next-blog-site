"use client";
import BlogCard from "@/components/BlogCard";
import LoadingComponent from "@/components/layout/LoadingComponent";
import PaginationComponent from "@/components/layout/PaginationComponent";
import { IMAGE_FOUND } from "@/constants/image.constant";
import useQueryParams from "@/hooks/useQueryParams";
import { getPostByAuthorId, getUserId } from "@/services/query";
import { PostType } from "@/types/post.type";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Github, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

const size = 16;

const Page = () => {
  const { params, handleQuery } = useQueryParams();
  const { id } = useParams();
  const getAuthorIdResult = useQuery({
    queryKey: ["author", id],
    queryFn: async () => await getUserId(id as string),
    enabled: !!id,
  });
  const getPostByAuthorIdResult = useQuery({
    queryKey: ["post", "author", id, params.toString()],
    queryFn: async () =>
      await getPostByAuthorId(id as string, {
        page: params.get("page") as unknown as number,
      }),
    enabled: !!id,
  });
  const socialData = useMemo(() => {
    if (!getAuthorIdResult.data) return [];

    return [
      {
        icon: <Facebook size={size} />,
        href: getAuthorIdResult.data.link_facebook,
      },
      {
        icon: <Github size={size} />,
        href: getAuthorIdResult.data.link_github,
      },
      {
        icon: <Instagram size={size} />,
        href: getAuthorIdResult.data.link_instagram,
      },
      {
        icon: <Youtube size={size} />,
        href: getAuthorIdResult.data.link_youtube,
      },
      {
        icon: <Twitter size={size} />,
        href: getAuthorIdResult.data.link_twitter,
      },
    ];
  }, [getAuthorIdResult.data]);

  if (getAuthorIdResult.isLoading || getPostByAuthorIdResult.isLoading)
    return <LoadingComponent />;

  return (
    <div className="space-y-10">
      {/* author */}
      <div className="py-10 rounded-lg bg-box-bg">
        <div className="max-w-[668px] w-full mx-auto flex flex-col items-center gap-4">
          {/* avatar */}
          <div className="flex items-center gap-2">
            <div className="aspect-square relative w-10 rounded-full overflow-hidden">
              <Image
                src={getAuthorIdResult.data?.avatar || IMAGE_FOUND.avatar_found}
                alt="avatar"
                fill
              />
            </div>
            <div>
              <h6 className="font-medium ">{getAuthorIdResult.data?.name}</h6>
              <div className="text-xs text-text-color-2">
                {getAuthorIdResult.data?.job}
              </div>
            </div>
          </div>
          <div className="text-center text-sm">
            {getAuthorIdResult.data?.description}
          </div>
          {/* social */}
          <div className="space-x-2 text-center">
            {socialData.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || ""}
                className="bg-icon-bg text-white p-1 rounded inline-block"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* blogs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {getPostByAuthorIdResult.data?.results.map((item) => (
            <BlogCard key={item.id} data={item as unknown as PostType} />
          ))}
        </div>
        <div>
          <PaginationComponent
            currentPage={getPostByAuthorIdResult.data?.paginate.page || 1}
            totalPages={getPostByAuthorIdResult.data?.paginate.totalPages || 1}
            onPageChange={(e) => {
              handleQuery(`page`, e.toString());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
