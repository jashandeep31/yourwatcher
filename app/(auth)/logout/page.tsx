import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  await signOut();
  return redirect("/");
};

export default page;
