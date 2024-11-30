"use client";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { createSSLMonitoringTask } from "../_actions";

const CreateForm = () => {
  const [url, seturl] = useState("");
  const handleSubmit = async () => {
    await createSSLMonitoringTask(url);
  };
  return (
    <div>
      {" "}
      <div className="grid gap-6">
        <FormItem>
          <Label className="text-muted-foreground font-medium">
            Add your service URL
          </Label>
          <Input onChange={(e) => seturl(e.target.value)} name="url" />
        </FormItem>
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
