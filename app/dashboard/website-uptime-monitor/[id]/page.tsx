import { auth } from "@/lib/auth";
import { KESTRA_AUTHORIZATION, KESTRA_URL } from "@/lib/conts";
import { db } from "@/lib/db";
import axios from "axios";
import { redirect } from "next/navigation";
import React from "react";
import TableView from "./components/TableView";
import ChartView from "./components/ChartView";

type ILabel =
  | { key: "status"; value: "up" | "down" }
  | {
      key: "check_time";
      value: Date;
    };

export interface IExecution {
  id: string;
  namespace: string;
  flowId: string;
  flowRevision: number;
  taskRunList: unknown[];
  labels: ILabel[];
  state: unknown;
  originalId: string;
  deleted: boolean;
  metadata: unknown;
  scheduleDate: Date;
}
const getLast24Hours = () => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    startDate: last24Hours.toISOString(),
    endDate: now.toISOString(),
  };
};

// Get date-time range for the last 24 hours

const getExecutions = async (taskId: string) => {
  try {
    const { startDate, endDate } = getLast24Hours();
    console.log(taskId);
    const res = await axios.get(
      KESTRA_URL +
        `/api/v1/executions/search?namespace=monitoring.websites&flowId=${taskId}&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: KESTRA_AUTHORIZATION } }
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      total: 0,
      results: null,
    };
  }
};

const page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return redirect("/");
  }

  const task = await db.websiteMonitoringTask.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });
  if (!task) return <h1>task not found</h1>;
  const { results }: { results: IExecution[] } = await getExecutions(
    task.kestraId
  );
  if (!results) return <h1>executions not found, Internal error, Try later</h1>;
  return (
    <div className="m-4 ">
      <h1 className="md:text-2xl font-bold">Indepth Report</h1>
      <p className="text-sm text-muted-foreground">
        Indepth report of webite `{task.url}` uptime monitoring
      </p>
      <div className="mt-12 ">
        <ChartView executions={results} />
      </div>

      <div className="mt-12">
        <TableView executions={results} />
      </div>
    </div>
  );
};

export default page;
