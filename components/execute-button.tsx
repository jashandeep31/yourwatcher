"use client";
import { executeFlow } from "@/actions";
import { Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ExecuteButton = ({
  id,
  model,
  path,
  namespace,
}: {
  id: string;
  namespace: string;
  path?: string;
  model: "websiteMonitoringTask" | "sSLMonitoringTask" | "domainMonitoringTask";
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const execute = async () => {
    setIsExecuting(true);
    const toastId = toast.loading("Executing task");
    const res = await executeFlow({
      id,
      model,
      namespace,
      path,
    });

    if (res.status === "ok") {
      toast.success("Task executed", { id: toastId });
    } else {
      toast.error("Failed to execute task", { id: toastId });
    }
    setIsExecuting(false);
  };
  return (
    <button
      disabled={isExecuting}
      className="text-blue-500 border-blue-500 rounded-full p-1 border  "
      onClick={execute}
    >
      <Zap size={15} />
    </button>
  );
};

export default ExecuteButton;
