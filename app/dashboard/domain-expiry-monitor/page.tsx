import React from "react";
import CreateForm from "./compnents/create-form";

const page = () => {
  return (
    <div className="m-4">
      <h1 className="md:text-2xl font-bold">Domain Expiry Monitor</h1>
      <p className="text-sm text-muted-foreground">
        Monitor your domain that you hold or want to buy.
      </p>

      <div className="mt-12">
        <CreateForm />
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default page;
