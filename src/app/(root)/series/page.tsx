"use client";
import PaginationComponent from "@/components/layout/PaginationComponent";
import { useQuery } from "@tanstack/react-query";
import { getAllSeries } from "@/services/query";
import useQueryParams from "@/hooks/useQueryParams";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { SeriesType } from "@/types/series.type";
import SeriesCard from "@/components/SeriesCard";

const Page = () => {
  const { params, handleQuery } = useQueryParams();
  const getAllResult = useQuery({
    queryKey: ["post", params.toString()],
    queryFn: async () =>
      getAllSeries({
        page: params.get("page") as unknown as number,
      }),
  });

  if (getAllResult.isLoading) return <LoadingComponent />;

  if (getAllResult.data?.results.length === 0) return <div>Not found.</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {getAllResult.data?.results.map((item) => (
          <SeriesCard key={item.id} data={item as unknown as SeriesType} />
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
