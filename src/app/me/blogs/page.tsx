"use client";
import ButtonDeleteConfirm from "@/components/ButtonDeleteConfirm";
import { DataTable } from "@/components/form/data-table";
import InputSearchComponent from "@/components/layout/InputSearchComponent";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IMAGE_FOUND } from "@/constants/image.constant";
import useQueryParams from "@/hooks/useQueryParams";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/post.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  //
  const { params, handleQuery } = useQueryParams();
  const page = Number(params.get("page")) || 1;
  const q = params.get("q") || "";
  const [qValue, setQValue] = useState(q || "");
  const { getAll, updateById, deleteById, data } = usePostStore();
  const updateByIdResult = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PostType }) =>
      await updateById(id, data),
  });
  const deleteByIdResult = useMutation({
    mutationFn: async (id: string) => await deleteById(id),
    onSuccess: () => {
      toast.success(`Deleted successfully!`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  //
  const getAllResult = useQuery({
    queryKey: ["post", "me", params.toString()],
    queryFn: async () => getAll({ page: page, q: q }),
  });
  //
  const columns: ColumnDef<PostType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link href={`/blog/` + row.original.id} className="line-clamp-2">
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <div className="relative rounded-lg overflow-hidden w-20 aspect-video">
          <Image
            fill
            src={row.original.thumbnail || IMAGE_FOUND.post_found}
            alt="thumbnail"
          />
        </div>
      ),
    },
    {
      accessorKey: "published",
      header: "Published",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.published}
          disabled={updateByIdResult.isPending}
          onClick={() =>
            updateByIdResult.mutate({
              id: row.original.id,
              data: {
                published: !row.original.published,
              } as PostType,
            })
          }
        />
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="space-x-3">
          <Link href={`/me/blogs/update/` + row.original.id}>
            <Button size={"sm"} variant={"default"} className="text-xs">
              Update
            </Button>
          </Link>
          <ButtonDeleteConfirm
            onClick={() => deleteByIdResult.mutate(row.original.id)}
          />
        </div>
      ),
    },
  ];

  if (getAllResult.isLoading) return <LoadingComponent />;

  return (
    <div className="space-y-4">
      {/* action */}
      <div className="flex items-center justify-between gap-8">
        <InputSearchComponent
          value={qValue}
          onChange={(e) => setQValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleQuery("q", qValue);
            }
          }}
        />
        <Link href={"/me/blogs/create"}>
          <Button size={"sm"}>Create</Button>
        </Link>
      </div>
      {/* data */}
      <DataTable
        columns={columns}
        data={data}
        paginate={{
          totalPages: getAllResult.data?.paginate.totalPages || 1,
          page: getAllResult.data?.paginate.page || 1,
          onChange: (e) => {
            handleQuery("page", e.toString());
          },
        }}
      />
    </div>
  );
};

export default Page;
