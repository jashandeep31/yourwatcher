import React from "react";
import CreateForm from "./components/create-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import TableView from "./components/table-view";

const page = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return {
      error: "Not authorized",
      status: "err",
    };
  }

  const sslFlows = await db.sSLMonitoringTask.findMany({
    where: {
      userId: session.user.id,
    },
  });
  return (
    <div className="m-4 ">
      <h1 className="md:text-2xl font-bold">SSL certificate Monitoring</h1>
      <p className="text-sm text-muted-foreground">
        Track your ssl certificates daily get notified as they expires.
      </p>
      <div className="mt-12">
        <CreateForm />
      </div>
      <div className="mt-12">
        <TableView tasks={sslFlows} />
      </div>
    </div>
  );
};

export default page;
