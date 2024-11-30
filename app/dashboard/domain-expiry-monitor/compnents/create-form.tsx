"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  url: z.string().min(2).max(100),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add the Domain of service</FormLabel>
                <FormControl>
                  <Input placeholder="jashan.dev" {...field} />
                </FormControl>
                <FormDescription>
                  Make sure to add proper domain to start checking domain
                  expiry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            Start Monitoring
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateForm;
