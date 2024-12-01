import React from "react";
import CreateForm from "./compnents/create-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import TableView from "./compnents/table-view";

const page = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return {
      error: "Not authorized",
      status: "err",
    };
  }
  const domainExpiryTasks = await db.domainMonitoringTask.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(domainExpiryTasks);
  return (
    <div className="m-4">
      <h1 className="md:text-2xl font-bold">Domain Expiry Monitor</h1>
      <p className="text-sm text-muted-foreground">
        Monitor your domain that you hold or want to buy.
      </p>

      <div className="mt-12">
        <CreateForm />
      </div>
      <div className="mt-12">
        <TableView tasks={domainExpiryTasks} />
      </div>
    </div>
  );
};

export default page;
