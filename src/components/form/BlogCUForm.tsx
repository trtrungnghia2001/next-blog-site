"use client";
import dynamic from "next/dynamic";
const ReactQuillEditor = dynamic(() => import("../form/react-quill-editor"), {
  ssr: false,
});
import React, { memo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { category_options } from "@/constants/option.constant";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/post.type";
import { toast } from "sonner";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getPostId } from "@/services/query";
import UploadButton from "../UploadButton";
import LoadingComponent from "../layout/LoadingComponent";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  thumbnail: z.string(),
  content: z.string(),
  published: z.boolean(),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  origin_post: z.string(),
  description: z.string(),
});
const initValues: Partial<PostType> = {
  title: "",
  thumbnail: "",
  content: "",
  category: "",
  origin_post: "",
  description: "",
  published: true,
};

const BlogCUForm = () => {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    createUpdateResult.mutate(values as unknown as PostType);
  }

  const { create, updateById } = usePostStore();
  const { id } = useParams();
  const pathName = usePathname();
  const isUpdate = pathName.includes("/update/");
  const getIdResult = useQuery({
    queryKey: ["post", id],
    queryFn: async () => getPostId(id as string),
    enabled: !!id,
  });
  useEffect(() => {
    if (getIdResult.data && isUpdate) {
      Object.entries(getIdResult.data).forEach(([key, value]) => {
        if (value) {
          form.setValue(
            key as keyof z.infer<typeof formSchema>,
            getIdResult.data?.[
              key as keyof z.infer<typeof formSchema>
            ] as string
          );
        }
      });
    }
  }, [getIdResult.data]);

  const createUpdateResult = useMutation({
    mutationFn: async (data: PostType) => {
      if (isUpdate) {
        return await updateById(id as string, data);
      }
      return await create(data);
    },
    onSuccess: () => {
      toast.success(
        isUpdate ? `Updated successfully!` : `Created successfully!`
      );
      form.reset();
      router.push("/me/blogs");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (getIdResult.isLoading) return <LoadingComponent />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadButton
                  image={field.value}
                  onChangeImage={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(e) => e && field.onChange(e)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {category_options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="origin_post"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin post</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <ReactQuillEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button disabled={createUpdateResult.isPending} type="submit">
          {createUpdateResult.isPending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default memo(BlogCUForm);
