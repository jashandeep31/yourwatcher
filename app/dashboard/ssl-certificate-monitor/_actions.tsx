"use server";

import { auth } from "@/lib/auth";
import { Response } from "../website-uptime-monitor/_actions";
import axios from "axios";
import { KESTRA_URL } from "@/lib/conts";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { sslMonitoringTaskFlow } from "./flow";

export const getDays = async (id: string): Promise<null | number> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return null;
    }
    const task = await db.sSLMonitoringTask.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    if (!task) return null;
    const res = await axios.get(
      KESTRA_URL + `/api/v1/namespaces/monitoring/kv/${task?.kestraId}-status`,
      {
        headers: {
          Authorization: `Basic akBqLmNvbTo1`,
        },
      }
    );
    // console.log(res.data);

    return res.data.value;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createSSLMonitoringTask = async (
  url: string
): Promise<Response> => {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return {
      error: "Not authorized",
      status: "err",
    };
  }
  if (!url) {
    return {
      error: "URL is required",
      status: "err",
    };
  }

  const uniqueId = `ssl-certificate-monitor-check-website` + uuid();

  const res = await axios.post(
    KESTRA_URL + "/api/v1/flows",
    sslMonitoringTaskFlow({ uniqueId, url }),
    {
      headers: {
        "Content-Type": "application/x-yaml",
        Authorization: `Basic akBqLmNvbTo1`,
      },
    }
  );

  if (res.status !== 200) {
    console.log(res.data);
    return {
      error: "Not implemented",
      status: "err",
    };
  }

  await db.sSLMonitoringTask.create({
    data: {
      userId: session.user.id,
      url: url,
      kestraId: uniqueId,
    },
  });

  revalidatePath("/dashboard/ssl-certificate-monitor");
  return {
    status: "ok",
    message: "Created SSL",
  };
};
