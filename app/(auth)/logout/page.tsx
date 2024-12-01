import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  (async () => {
    "use server";

    await signOut();
  })();
  return redirect("/");
};

export default page;
