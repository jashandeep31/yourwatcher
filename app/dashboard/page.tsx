import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <div className="m-4">
      <h1 className="md:text-2xl text-xl font-semibold text-gray-800">
        Welcome {session.user.name}!.
      </h1>
      <p className="text-orange-400">
        we are working on this page. till then you can use services from the
        left sidebar.
      </p>
    </div>
  );
};

export default page;
