"use client";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { SeriesType } from "@/types/series.type";
import { toast } from "sonner";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getSeriesId } from "@/services/query";
import UploadButton from "../UploadButton";
import LoadingComponent from "../layout/LoadingComponent";
import { Loader2 } from "lucide-react";
import { useSeriesStore } from "@/stores/series.store";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  thumbnail: z.string(),
  content: z.string(),
  category: z.string().min(1, {
    message: "Category is required",
  }),
});
const initValues: Partial<SeriesType> = {
  title: "",
  thumbnail: "",
  content: "",
  category: "",
};

const SeriesCUForm = () => {
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
    createUpdateResult.mutate(values as unknown as SeriesType);
  }

  const { create, updateById } = useSeriesStore();
  const { id } = useParams();
  const pathName = usePathname();
  const isUpdate = pathName.includes("/update/");
  const getIdResult = useQuery({
    queryKey: ["series", id],
    queryFn: async () => getSeriesId(id as string),
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
    mutationFn: async (data: SeriesType) => {
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
      router.push("/me/series");
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

        <Button disabled={createUpdateResult.isPending} type="submit">
          {createUpdateResult.isPending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default memo(SeriesCUForm);
