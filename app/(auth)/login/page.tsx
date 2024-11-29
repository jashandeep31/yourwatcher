import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="p-4 border rounded-md bg-background min-w-[25%]">
        <h1 className="md:text-2xl font-bold text-center">Login</h1>
        <div className="mt-6">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="submit" variant={"outline"} className="w-full">
              Login with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
