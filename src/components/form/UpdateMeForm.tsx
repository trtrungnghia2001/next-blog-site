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
import { UserType } from "@/types/user.type";
import { Textarea } from "../ui/textarea";
import { useUserStore } from "@/stores/user.store";
import { useMutation } from "@tanstack/react-query";
import UploadButton from "../UploadButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  avatar: z.string(),
  job: z.string(),
  description: z.string(),
  link_facebook: z.string(),
  link_github: z.string(),
  link_instagram: z.string(),
  link_twitter: z.string(),
  link_youtube: z.string(),
});
const initValues: Partial<UserType> = {
  name: "",
  avatar: "",
  job: "",
  description: "",
  link_facebook: "",
  link_github: "",
  link_instagram: "",
  link_twitter: "",
  link_youtube: "",
};

const UpdateMeForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMeResult.mutate(values as UserType);
  }

  const { user, updateMe } = useUserStore();
  useEffect(() => {
    if (user) {
      Object.entries(user).forEach(([key, value]) => {
        form.setValue(key as keyof z.infer<typeof formSchema>, value || "");
      });
    }
  }, [user]);
  const updateMeResult = useMutation({
    mutationFn: async (values: UserType) => await updateMe(values),
    onSuccess: () => {
      toast.success(`Update me successfully!`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadButton
                  avatar
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job</FormLabel>
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link facebook</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link github</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link instagram</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link twitter</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_youtube"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link youtute</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateMeResult.isPending}>
          {updateMeResult.isPending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default memo(UpdateMeForm);
