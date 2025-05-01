import { switchBookmark } from "@/services/query";
import { PostType } from "@/types/post.type";
import { useMutation } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { toast } from "sonner";

const SwitchBookmark = ({
  post,
  isPostBookmark,
}: {
  post: PostType;
  isPostBookmark: boolean;
}) => {
  // bookmark
  const [isBookmark, setIsBookmark] = useState(false);
  const switchBookmarkResult = useMutation({
    mutationFn: async () => switchBookmark(post.id),
    onSuccess: (data) => {
      if ((data as { count: number }).count > 0) {
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

  return (
    <button
      disabled={switchBookmarkResult.isPending}
      onClick={() => switchBookmarkResult.mutate()}
    >
      {isBookmark ? (
        <Bookmark size={20} className="text-blue-500" />
      ) : (
        <Bookmark size={20} />
      )}
    </button>
  );
};

export default memo(SwitchBookmark);
