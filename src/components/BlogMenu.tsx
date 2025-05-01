"use client";
import { switchBookmark } from "@/services/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSeriesStore } from "@/stores/series.store";
import useQueryParams from "@/hooks/useQueryParams";
import LoadingComponent from "./layout/LoadingComponent";
import SeriesItem from "./SeriesItem";

type BlogMenuType = {
  postId: string;
  isPostBookmark: boolean;
};

const BlogMenu = ({ isPostBookmark, postId }: BlogMenuType) => {
  // bookmark
  const [isBookmark, setIsBookmark] = useState(false);
  const switchBookmarkResult = useMutation({
    mutationFn: async () => switchBookmark(postId),
    onSuccess: () => {
      if (isPostBookmark) {
        toast.success(`Bookmark unsaved successfully!`);
      } else {
        toast.success(`Bookmark saved successfully!`);
      }
      setIsBookmark(!isBookmark);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  useEffect(() => {
    if (isPostBookmark) {
      setIsBookmark(true);
    }
  }, [isPostBookmark]);

  // series
  const [isOpenSeries, setIsOpenSeries] = useState(false);
  const { getAll: getAllSeries, data: series } = useSeriesStore();
  const { params } = useQueryParams();
  const page = Number(params.get("page")) || 1;
  const getAllSeriesResult = useQuery({
    queryKey: ["series", "me", params.toString()],
    queryFn: async () => getAllSeries({ page: page }),
    enabled: !!isOpenSeries,
  });

  if (getAllSeriesResult.isLoading) return <LoadingComponent />;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => switchBookmarkResult.mutate()}>
            {isBookmark ? `Remove Bookmark` : `Add Bookmark`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenSeries(true)}>
            Add to series
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={isOpenSeries}
        onOpenChange={() => {
          setIsOpenSeries(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to series</DialogTitle>
            <DialogDescription>Add posts to your series</DialogDescription>
          </DialogHeader>
          <ul className="space-y-4">
            {series.map((item) => (
              <li key={item.id}>
                <SeriesItem series={item} postId={postId} />
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(BlogMenu);
