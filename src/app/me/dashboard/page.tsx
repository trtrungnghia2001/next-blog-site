"use client";
import { DataTable } from "@/components/form/data-table";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { ChartConfig } from "@/components/ui/chart";
import { IMAGE_FOUND } from "@/constants/image.constant";
import { getPostByDashboard } from "@/services/query";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/post.type";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { category_options } from "@/constants/option.constant";

const Page = () => {
  //
  const { getAll, data: posts } = usePostStore();
  //
  const getAllResult = useQuery({
    queryKey: ["post", "me"],
    queryFn: async () => getAll(),
  });
  //
  const getPostByDashboardResult = useQuery({
    queryKey: ["post", "dashboard"],
    queryFn: async () => getPostByDashboard(),
  });

  // chart
  const chartData = category_options.map((item) => ({
    category: item.label,
    total_views:
      getPostByDashboardResult.data?.find(
        (value) =>
          value.category?.toLocaleLowerCase() === item.label.toLocaleLowerCase()
      )?._sum.total_views || 0,
  }));
  const chartConfig = {
    total_views: {
      label: "Total view",
      color: `var(--char-color)`,
    },
  } satisfies ChartConfig;

  // table
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.category}</div>
      ),
    },
    {
      accessorKey: "total_views",
      header: "Total views",
    },
  ];

  if (getAllResult.isLoading) return <LoadingComponent />;

  return (
    <div className="space-y-10 overflow-hidden">
      {/* chart */}
      <ChartContainer
        config={chartConfig}
        className="min-h-52 w-full overflow-hidden"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={"category"}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey={"total_views"} fill="var(--char-color)" radius={4} />
          {/*  <Bar dataKey={"viewer"} fill="var(--char-color)" radius={4} /> */}
          {/* <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
        </BarChart>
      </ChartContainer>
      {/* blog */}
      <div className="space-y-4">
        <h5>Blog</h5>
        <DataTable columns={columns} data={posts} />
      </div>
    </div>
  );
};

export default Page;
