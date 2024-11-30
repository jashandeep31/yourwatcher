import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IExecution } from "../page";

const TableView = ({ executions }: { executions: IExecution[] }) => {
  return (
    <div className="">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.no</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((execution, index) => (
            <TableRow key={execution.id}>
              <TableCell className="font-medium">{index++}</TableCell>
              <TableCell>{execution.id}</TableCell>
              <TableCell>
                {
                  executions[0].labels.find((label) => label.key === "status")
                    ?.value
                }
              </TableCell>
              <TableCell className="text-right">
                {String(
                  executions[0].labels.find(
                    (label) => label.key === "check_time"
                  )?.value
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
