"use server";
import { auth } from "@/lib/auth";
import { Response } from "../website-uptime-monitor/_actions";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { KESTRA_AUTHORIZATION, KESTRA_URL } from "@/lib/conts";
import { domainExpiryMonitorFlow } from "./flow";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type getDomainInfoResponse =
  | {
      status: "ok";
      data: unknown;
    }
  | {
      error: string;
      status: "err";
    };

export const getDomainInfo = async (
  id: string
): Promise<getDomainInfoResponse> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        error: "Not authorized",
        status: "err",
      };
    }
    const task = await db.domainMonitoringTask.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    if (!task) {
      return {
        error: "Task not found",
        status: "err",
      };
    }

    const res = await axios.get(
      KESTRA_URL +
        `/api/v1/namespaces/domain-monitoring/kv/${task?.kestraId}-status`,
      {
        headers: {
          Authorization: KESTRA_AUTHORIZATION,
        },
      }
    );
    return {
      status: "ok",
      data: res.data,
    };
  } catch {
    return {
      error: "Something went wrong, please try again",
      status: "err",
    };
  }
};

export const createDomainExpiryMonitoringTask = async (
  domain: string
): Promise<Response> => {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id || !session.user.email) {
      return {
        error: "Not authorized",
        status: "err",
      };
    }
    const uniqueId = `check-domain-expiry` + uuid();
    if (!domain) {
      return {
        error: "Domain is required",
        status: "err",
      };
    }
    const res = await axios.post(
      KESTRA_URL + "/api/v1/flows",
      domainExpiryMonitorFlow({
        id: uniqueId,
        domain,
        email: session.user.email,
      }),
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
    await db.domainMonitoringTask.create({
      data: {
        userId: session.user.id,
        domain: domain,
        kestraId: uniqueId,
      },
    });
    revalidatePath("/dashboard/domain-expiry-monitor");

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
