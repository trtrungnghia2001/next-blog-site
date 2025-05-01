"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getPostBySeriesId,
  getSeriesId,
  increaseSeries,
} from "@/services/query";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { useUserStore } from "@/stores/user.store";
import Image from "next/image";
import { IMAGE_FOUND } from "@/constants/image.constant";
import Link from "next/link";
import useQueryParams from "@/hooks/useQueryParams";
import PaginationComponent from "@/components/layout/PaginationComponent";
import BlogCard from "@/components/BlogCard";
import { PostType } from "@/types/post.type";

const Page = () => {
  const { params, handleQuery } = useQueryParams();
  const { id } = useParams();
  const { user } = useUserStore();
  const getIdResult = useQuery({
    queryKey: [`series`, id],
    queryFn: async () => getSeriesId(id as string),
    enabled: !!id,
  });
  const getPostBySeriesIdResult = useQuery({
    queryKey: ["post", "series", id, params.toString()],
    queryFn: async () =>
      await getPostBySeriesId(id as string, {
        page: params.get("page") as unknown as number,
      }),
    enabled: !!id,
  });
  const increaseResult = useQuery({
    queryKey: [`series`, `increase`, id],
    queryFn: async () => await increaseSeries(id as string),
    enabled: !!user,
  });

  if (
    getIdResult.isLoading ||
    getPostBySeriesIdResult.isLoading ||
    increaseResult.isLoading
  )
    return <LoadingComponent />;

  return (
    <div className="space-y-10">
      {/* top */}
      <div className="py-10 rounded-lg bg-box-bg">
        <div className="max-w-[668px] w-full mx-auto flex flex-col items-center gap-4">
          <h4>{getIdResult.data?.title}</h4>
          <div className="text-center text-sm">{getIdResult.data?.content}</div>
          <Link
            href={`/author/` + getIdResult.data?.author?.id}
            className="flex items-center gap-2"
          >
            <div className="aspect-square relative w-10 rounded-full overflow-hidden">
              <Image
                src={
                  getIdResult.data?.author?.avatar || IMAGE_FOUND.avatar_found
                }
                alt="avatar"
                fill
              />
            </div>
            <div>
              <h6 className="font-medium ">{getIdResult.data?.author?.name}</h6>
              <div className="text-xs text-text-color-2">
                {getIdResult.data?.author?.job}
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* blogs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {getPostBySeriesIdResult.data?.results.map((item) => (
            <BlogCard key={item.id} data={item as unknown as PostType} />
          ))}
        </div>
        <div>
          <PaginationComponent
            currentPage={getPostBySeriesIdResult.data?.paginate.page || 1}
            totalPages={getPostBySeriesIdResult.data?.paginate.totalPages || 1}
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
