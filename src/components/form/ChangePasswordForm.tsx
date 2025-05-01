"use client";
import React, { memo } from "react";
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
import { useUserStore } from "@/stores/user.store";
import { useMutation } from "@tanstack/react-query";
import { PasswordType } from "@/types/user.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  confirm_password: z.string().min(1, {
    message: "Confirm password is required.",
  }),
});
const initValues = {
  password: "",
  confirm_password: "",
};

const ChangePasswordForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    changePasswordResult.mutate(values);
  }

  const { changePassword } = useUserStore();
  const changePasswordResult = useMutation({
    mutationFn: async (data: PasswordType) => changePassword(data),
    onSuccess: () => {
      toast.success(`Change passwprd successfully!`);
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={changePasswordResult.isPending}>
          {changePasswordResult.isPending && (
            <Loader2 className="animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default memo(ChangePasswordForm);
