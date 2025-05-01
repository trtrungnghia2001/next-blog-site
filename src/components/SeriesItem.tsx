"use client";
import React, { memo, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { SeriesType } from "@/types/series.type";
import { useMutation } from "@tanstack/react-query";
import { switchBlogToSeries } from "@/services/query";
import { toast } from "sonner";

type SeriesItemType = {
  series: SeriesType;
  postId: string;
};

const SeriesItem = ({ series, postId }: SeriesItemType) => {
  const [isCheck, setIsCheck] = useState(false);
  const switchBlogToSeriesResult = useMutation({
    mutationFn: async () => await switchBlogToSeries(series.id, postId),
    onSuccess: () => {
      if (isCheck) {
        toast.error(`Remove to series successfully!`);
      } else {
        toast.success(`Add to series successfully!`);
      }
      setIsCheck(!isCheck);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  useEffect(() => {
    const check = series.postsOfSeries.find((item) => item.postId === postId);
    if (check) {
      setIsCheck(true);
    }
  }, [series, postId]);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={series.id}
        disabled={switchBlogToSeriesResult.isPending}
        checked={isCheck}
        onCheckedChange={() => switchBlogToSeriesResult.mutate()}
      />
      <label
        htmlFor={series.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {series.title}
      </label>
    </div>
  );
};

export default memo(SeriesItem);
