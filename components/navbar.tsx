import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <div className="border-b py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Your Watcher</h1>
          <div className="hidden md:flex items-center gap-6">
            <nav>
              <Link className="text-muted-foreground " href={"/"}>
                Home
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex itmes-center gap-4">
          <Link href={"/login"} className={buttonVariants()}>
            Login
          </Link>
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;