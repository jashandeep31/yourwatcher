import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="p-4 border rounded-md bg-background min-w-[25%]">
        <h1 className="md:text-2xl font-bold text-center">Sign Up</h1>
        <div className="mt-6">
          <Button variant={"outline"} className="w-full">
            Sign Up with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
