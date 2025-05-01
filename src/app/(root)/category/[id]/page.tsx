"use client";
import BlogCard from "@/components/BlogCard";
import PaginationComponent from "@/components/layout/PaginationComponent";
import { useQuery } from "@tanstack/react-query";
import { getPostByCategoryId } from "@/services/query";
import { PostType } from "@/types/post.type";
import useQueryParams from "@/hooks/useQueryParams";
import { useParams } from "next/navigation";
import LoadingComponent from "@/components/layout/LoadingComponent";

const Page = () => {
  const { id } = useParams();
  const { params, handleQuery } = useQueryParams();

  const getAllResult = useQuery({
    queryKey: ["category", id, params.toString()],
    queryFn: async () =>
      getPostByCategoryId(id as string, {
        page: params.get("page") as unknown as number,
      }),
    enabled: !!id,
  });

  if (getAllResult.isLoading) return <LoadingComponent />;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {getAllResult.data?.results.map((item) => (
          <BlogCard key={item.id} data={item as unknown as PostType} />
        ))}
      </div>
      <div>
        <PaginationComponent
          currentPage={getAllResult.data?.paginate.page || 1}
          totalPages={getAllResult.data?.paginate.totalPages || 1}
          onPageChange={(e) => {
            handleQuery(`page`, e.toString());
          }}
        />
      </div>
    </div>
  );
};

export default Page;
