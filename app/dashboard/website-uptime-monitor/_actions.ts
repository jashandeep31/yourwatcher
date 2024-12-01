"use server";
import axios from "axios";
import { auth } from "@/lib/auth";
import { KESTRA_AUTHORIZATION, KESTRA_URL } from "@/lib/conts";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { websiteMonitoringTaskFlow } from "./flow";
export type Response =
  | {
      error: string;
      status: "err";
    }
  | {
      message: string;
      status: "ok";
    };
interface MonitoringData {
  url: string;
}
export const deleteWebsiteMonitoringTask = async ({
  id,
}: {
  id: string;
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
      const task = await tx.websiteMonitoringTask.delete({
        where: {
          id,
        },
      });
      await axios({
        method: "delete",
        url: `${KESTRA_URL}/api/v1/flows/delete/by-ids`,
        headers: {
          Authorization: KESTRA_AUTHORIZATION,
          "Content-Type": "application/json",
        },
        data: [
          {
            namespace: "monitoring.websites",
            id: task.kestraId,
          },
        ],
      });
    });
    revalidatePath("/dashboard/website-uptime-monitor");

    return {
      status: "ok",
      message: "okay",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return {
      error: "Something went wrong, please try again",
      status: "err",
    };
  }
};
export const disableWebsiteMonitoringTask = async ({
  id,
}: {
  id: string;
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
      const task = await tx.websiteMonitoringTask.update({
        where: {
          id,
        },
        data: {
          status: "DISABLED",
        },
      });
      await axios({
        method: "post",
        url: `${KESTRA_URL}/api/v1/flows/disable/by-ids`,
        headers: {
          Authorization: KESTRA_AUTHORIZATION,
          "Content-Type": "application/json",
        },
        data: [
          {
            namespace: "monitoring.websites",
            id: task.kestraId,
          },
        ],
      });
    });
    revalidatePath("/dashboard/website-uptime-monitor");
    return {
      status: "ok",
      message: "okay",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    console.log(e);
    return {
      error: "Something went wrong, please try again",
      status: "err",
    };
  }
};
export const enableWebsiteMonitoringTask = async ({
  id,
}: {
  id: string;
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
      const task = await tx.websiteMonitoringTask.update({
        where: {
          id,
        },
        data: {
          status: "RUNNING",
        },
      });
      await axios({
        method: "post",
        url: `${KESTRA_URL}/api/v1/flows/enable/by-ids`,
        headers: {
          Authorization: KESTRA_AUTHORIZATION,
          "Content-Type": "application/json",
        },
        data: [
          {
            namespace: "monitoring.websites",
            id: task.kestraId,
          },
        ],
      });
    });
    revalidatePath("/dashboard/website-uptime-monitor");
    return {
      status: "ok",
      message: "okay",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return {
      error: "Something went wrong, please try again",
      status: "err",
    };
  }
};

export const createWebsiteMonitoringTask = async ({
  data,
}: {
  data: unknown;
}): Promise<Response> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id || !session.user.email) {
      return {
        error: "Not authorized",
        status: "err",
      };
    }

    const monitoringData = data as MonitoringData;
    const url = monitoringData.url;
    if (!url) {
      return {
        error: "Not implemented",
        status: "err",
      };
    }
    const uniqueId = `check-website` + uuid();
    const res = await axios.post(
      KESTRA_URL + "/api/v1/flows",
      websiteMonitoringTaskFlow({ uniqueId, url, email: session.user.email }),
      {
        headers: {
          "Content-Type": "application/x-yaml",
          Authorization: KESTRA_AUTHORIZATION,
        },
      }
    );
    if (res.status !== 200) {
      return {
        error: "Not implemented",
        status: "err",
      };
    }

    await db.websiteMonitoringTask.create({
      data: {
        userId: session.user.id,
        url: url,
        kestraId: uniqueId,
      },
    });
    revalidatePath("/dashboard/website-uptime-monitor");

    return {
      status: "ok",
      message: "okay",
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Something went wrong, please try again",
      status: "err",
    };
  }
};
