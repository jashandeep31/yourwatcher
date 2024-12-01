import React from "react";
import CreateForm from "./components/create-form";

const page = () => {
  return (
    <div className="m-4">
      <h1 className="md:text-2xl font-bold">VPS monitoring</h1>
      <p className="text-sm text-muted-foreground">
        VPS monitoring helps you to track vps resources consumption.
      </p>
      <div className="mt-12">
        <CreateForm />
      </div>
    </div>
  );
};

export default page;
