"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import type { DomainMonitoringTask } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import Link from "next/link";
import { deleteFlow, toogleFlowStatus } from "@/actions";
import { toast } from "sonner";
import { getDomainInfo } from "../_action";

const TableView = ({ tasks }: { tasks: DomainMonitoringTask[] }) => {
  return (
    <div>
      <p className="mb-4 text-orange-500">
        Tracking start after 00:00 of next day after adding new item.
      </p>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead>Domain </TableHead>
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
                  {task.domain}
                </Link>
              </TableCell>
              <TableCell>{task.status}</TableCell>
              <DomainInfoRenderer id={task.id} />
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
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
                            namespace: "domain-monitoring",
                            status: "RUNNING",
                            path: "/dashboard/ssl-certificate-monitor",
                            model: "domainMonitoringTask",
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
                            namespace: "domain-monitoring",
                            status: "DISABLED",
                            path: "/dashboard/ssl-certificate-monitor",
                            model: "domainMonitoringTask",
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
                          namespace: "domain-monitoring",
                          path: "/dashboard/ssl-certificate-monitor",
                          model: "domainMonitoringTask",
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

const DomainInfoRenderer = ({ id }: { id: string }) => {
  const [value, setvalue] = useState("loading..");
  useEffect(() => {
    (async () => {
      const res = await getDomainInfo(id);
      console.log(res);
      if (res.status === "ok") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res.data as any;
        if (data.value.days_remaining && data.value.status === "active") {
          setvalue(data.value.days_remaining);
        } else if (data.value.status !== "active") {
          setvalue("Domain not active");
        } else {
          setvalue("error");
        }
      } else {
        setvalue("error");
      }
    })();
  }, [id]);

  return <TableCell>{value}</TableCell>;
};

export default TableView;
