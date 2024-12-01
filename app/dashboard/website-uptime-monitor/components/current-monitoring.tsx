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
import React from "react";
import type { WebsiteMonitoringTask } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  deleteWebsiteMonitoringTask,
  disableWebsiteMonitoringTask,
  enableWebsiteMonitoringTask,
} from "../_actions";
import Link from "next/link";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";

const CurrnetMonitoring = ({ tasks }: { tasks: WebsiteMonitoringTask[] }) => {
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead className="md:min-w-auto min-w-[300px]">
              Website
            </TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Created On</TableHead>
            <TableHead className="text-right w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{task.url} </TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                {new Date(task.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right inline-flex gap-3 w-[150px] justify-end">
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                  href={`/dashboard/website-uptime-monitor/${task.id}`}
                >
                  Indepth view
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {task.status === "DISABLED" ? (
                      <DropdownMenuItem
                        className=""
                        onClick={async () => {
                          const toastId = toast.loading("Enabling task");
                          const res = await enableWebsiteMonitoringTask({
                            id: task.id,
                          });
                          if (res.status === "ok") {
                            toast.success("Task enabled", { id: toastId });
                          } else {
                            toast.error("Failed to enable task", {
                              id: toastId,
                            });
                          }
                        }}
                      >
                        Enable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className=""
                        onClick={async () => {
                          const toastId = toast.loading("Disabling task");
                          const res = await disableWebsiteMonitoringTask({
                            id: task.id,
                          });
                          if (res.status === "ok") {
                            toast.success("Task disabled", { id: toastId });
                          } else {
                            toast.error("Failed to disable task", {
                              id: toastId,
                            });
                          }
                        }}
                      >
                        Disable
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={async () => {
                        const toastId = toast.loading("Deleting task");
                        const res = await deleteWebsiteMonitoringTask({
                          id: task.id,
                        });
                        if (res.status === "ok") {
                          toast.success("Task deleted", { id: toastId });
                        } else {
                          toast.error("Failed to delete task", { id: toastId });
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

export default CurrnetMonitoring;
