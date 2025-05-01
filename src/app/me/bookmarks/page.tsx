"use client";
import BlogCard from "@/components/BlogCard";
import PaginationComponent from "@/components/layout/PaginationComponent";
import { useQuery } from "@tanstack/react-query";
import { getBookmarkByMe } from "@/services/query";
import { PostType } from "@/types/post.type";
import useQueryParams from "@/hooks/useQueryParams";
import LoadingComponent from "@/components/layout/LoadingComponent";

const Page = () => {
  const { params, handleQuery } = useQueryParams();
  const getAllResult = useQuery({
    queryKey: ["bookmark", params.toString()],
    queryFn: async () =>
      getBookmarkByMe({
        page: params.get("page") as unknown as number,
      }),
  });

  if (getAllResult.isLoading) return <LoadingComponent />;

  if (getAllResult.data?.results.length === 0) return <div>Not found</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {getAllResult.data?.results.map((item) => (
          <BlogCard
            key={item.post.id}
            data={item.post as unknown as PostType}
          />
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
