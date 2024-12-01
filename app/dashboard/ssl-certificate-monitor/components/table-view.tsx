"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import type { SSLMonitoringTask } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import Link from "next/link";
import { deleteFlow, toogleFlowStatus } from "@/actions";
import { getDays } from "../_actions";
import { toast } from "sonner";
import ExecuteButton from "@/components/execute-button";

const TableView = ({ tasks }: { tasks: SSLMonitoringTask[] }) => {
  return (
    <div>
      <p className="mb-4 text-orange-500">
        Tracking start after 00:00 of next day after adding new item.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Expires in</TableHead>
            <TableHead className="min-w-[100px]">Created On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Link href={`/dashboard/website-uptime-monitor/${task.id}`}>
                  {task.url}
                </Link>
              </TableCell>
              <TableCell>{task.status}</TableCell>
              <Days id={task.id} />
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell
                className="text-right flex imtece
               justify-end"
              >
                <ExecuteButton
                  id={task.id}
                  path="/dashboard/ssl-certificate-monitor"
                  namespace="monitoring"
                  model="sSLMonitoringTask"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {task.status === "DISABLED" ? (
                      <DropdownMenuItem
                        className=""
                        onClick={async () => {
                          const toastId = toast.loading(
                            "Enabling SSL monitoring task"
                          );
                          const res = await toogleFlowStatus({
                            id: task.id,
                            namespace: "monitoring",
                            status: "RUNNING",
                            path: "/dashboard/ssl-certificate-monitor",
                            model: "sSLMonitoringTask",
                          });
                          if (res.status === "ok") {
                            toast.success("SSL Monitoring task enabled", {
                              id: toastId,
                            });
                          } else {
                            toast.error(
                              "Failed to enable SSL monitoring task",
                              { id: toastId }
                            );
                          }
                        }}
                      >
                        Enable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className=""
                        onClick={async () => {
                          const toastId = toast.loading("Disabling SSL task");
                          const res = await toogleFlowStatus({
                            id: task.id,
                            namespace: "monitoring",
                            status: "DISABLED",
                            path: "/dashboard/ssl-certificate-monitor",
                            model: "sSLMonitoringTask",
                          });
                          if (res.status === "ok") {
                            toast.success("SSL Monitoring task disabled", {
                              id: toastId,
                            });
                          } else {
                            toast.error(
                              "Failed to disable SSL monitoring task",
                              { id: toastId }
                            );
                          }
                        }}
                      >
                        Disable
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={async () => {
                        const toastId = toast.loading("Deleting SSL task");
                        const res = await deleteFlow({
                          id: task.id,
                          namespace: "monitoring",
                          path: "/dashboard/ssl-certificate-monitor",
                          model: "sSLMonitoringTask",
                        });
                        if (res.status === "ok") {
                          toast.success("SSL Monitoring task deleted", {
                            id: toastId,
                          });
                        } else {
                          toast.error("Failed to delete SSL monitoring task", {
                            id: toastId,
                          });
                        }
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Days = ({ id }: { id: string }) => {
  const [days, setDays] = useState("loading");
  useEffect(() => {
    (async () => {
      const resDays = await getDays(id);
      console.log(resDays);
      if (!resDays) {
        setDays("error");
        return;
      }
      setDays(String(resDays) + " days");
    })();
  }, [id]);

  return <TableCell>{days}</TableCell>;
};

export default TableView;
