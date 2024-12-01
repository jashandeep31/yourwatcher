"use server";

import { Response } from "@/app/dashboard/website-uptime-monitor/_actions";
import { auth } from "@/lib/auth";
import { KESTRA_URL } from "@/lib/conts";
import { db } from "@/lib/db";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const deleteFlow = async ({
  id,
  namespace,
  path,
  model,
}: {
  id: string;
  namespace: string;
  path?: string;
  model: "websiteMonitoringTask" | "sSLMonitoringTask" | "domainMonitoringTask";
}): Promise<Response> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        error: "Not authorized",
        status: "err",
      };
    }

    await db.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const task = await (tx[model] as any).delete({
        where: {
          id,
        },
      });
      await axios({
        method: "delete",
        url: `${KESTRA_URL}/api/v1/flows/delete/by-ids`,
        headers: {
          Authorization: `Basic akBqLmNvbTo1`,
          "Content-Type": "application/json",
        },
        data: [
          {
            namespace: namespace,
            id: task.kestraId,
          },
        ],
      });
    });

    if (path) revalidatePath(path);
    return {
      status: "ok",
      message: "okay",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      error: "Not authorized",
      status: "err",
    };
  }
};

export const toogleFlowStatus = async ({
  id,
  namespace,
  status,
  model,
  path,
}: {
  id: string;
  namespace: string;
  status: "DISABLED" | "RUNNING";
  path?: string;
  model: "websiteMonitoringTask" | "sSLMonitoringTask" | "domainMonitoringTask";
}): Promise<Response> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        error: "Not authorized",
        status: "err",
      };
    }

    await db.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const task = await (tx[model] as any).update({
        where: {
          id,
        },
        data: {
          status: status,
        },
      });
      await axios.post(
        `${KESTRA_URL}/api/v1/flows/${
          status == "DISABLED" ? "disable" : "enable"
        }/by-ids`,
        [
          {
            namespace: namespace,
            id: task.kestraId,
          },
        ],
        {
          headers: {
            Authorization: `Basic akBqLmNvbTo1`,
            "Content-Type": "application/json",
          },
        }
      );
    });
    if (path) revalidatePath(path);

    return {
      status: "ok",
      message: "okay",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.log(e);
    return {
      error: "Not authorized",
      status: "err",
    };
  }
};
