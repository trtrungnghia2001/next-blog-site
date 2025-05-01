"use client";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import BlogSideSide from "@/components/BlogSideSide";
import { getAllPost } from "@/services/query";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/post.type";
import LoadingComponent from "@/components/layout/LoadingComponent";

export default function Home() {
  const getAllPostResult = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await getAllPost(),
  });
  const getAllPostViewResult = useQuery({
    queryKey: ["posts", "view"],
    queryFn: async () =>
      await getAllPost({
        sort: "total_views",
      }),
  });

  if (getAllPostResult.isLoading || getAllPostViewResult.isLoading)
    return <LoadingComponent />;

  return (
    <div className="space-y-10">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {getAllPostViewResult.data?.results.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2">
              <BlogSideSide data={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="space-y-4">
        <h4>Latest Post</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {getAllPostResult.data?.results.map((item) => (
            <BlogCard key={item.id} data={item as unknown as PostType} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Link href={`/blog`} className="text-blue-500 text-13">
          View more
        </Link>
      </div>
    </div>
  );
}
