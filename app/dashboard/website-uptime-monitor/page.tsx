import React from "react";
import CurrnetMonitoring from "./components/current-monitoring";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateForm from "./components/create-form";

const page = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return redirect("/");
  }
  const websiteMonitoringTasks = await db.websiteMonitoringTask.findMany({
    where: {
      userId: session.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="container md:m-4">
      <div>
        <h1 className="md:text-2xl font-bold">Track your services Uptime</h1>
        <p className="text-sm text-muted-foreground">
          This service will send you the discord/telegram alert when ever your
          service goes down. Checks after each 5min.
        </p>
      </div>

      <div className="mt-6">
        <CreateForm />
      </div>

      <div className="mt-12">
        <CurrnetMonitoring tasks={websiteMonitoringTasks} />
      </div>
    </div>
  );
};

export default page;
