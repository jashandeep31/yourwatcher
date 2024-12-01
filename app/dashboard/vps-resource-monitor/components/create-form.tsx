"use client";
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
import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2).max(100),
  ip: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
});
const CreateForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Creating monitoring task");
    const res = {
      status: "ok",
    };
    console.log(values);
    if (res.status === "ok") {
      toast.success("Domain Monitoring task created", { id: toastId });
      form.reset();
    } else {
      toast.error("Failed to create domain monitoring task", { id: toastId });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-3 gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter username of VPS</FormLabel>
                <FormControl>
                  <Input placeholder="jashan.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter IP of VPS</FormLabel>
                <FormControl>
                  <Input placeholder="jashan.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter passsword of VPS</FormLabel>
                <FormControl>
                  <Input placeholder="jashan.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button disabled={true} type="submit">
              Coming sooon.
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateForm;
