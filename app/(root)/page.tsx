import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bell, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <main className="flex-grow">
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="border rounded-full p-2  text-sm inline-block  text-muted-foreground bg-blue-100">
                Managed Kestra Flows
              </p>

              <h1 className="text-4xl mt-6 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">YourWatcher</span>
                <span className="block text-blue-600">
                  Watch all your automated tasks and much more
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Monitor, manage, and optimize your automated workflows with
                ease. Get real-time insights and notifications for all your
                tasks in one place.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
                <Link
                  href={"/login"}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto  "
                  )}
                >
                  Get started
                </Link>
                <Link
                  href={"/login"}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "w-full sm:w-auto  "
                  )}
                >
                  Github
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Real-time Monitoring"
                description="Keep track of all your automated tasks in real-time, ensuring smooth operations and quick issue detection."
              />
              <FeatureCard
                icon={<Bell className="h-8 w-8 text-blue-600" />}
                title="Smart Notifications"
                description="Receive instant alerts and notifications when tasks complete, fail, or require attention."
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8 text-blue-600" />}
                title="Insightful Analytics"
                description="Gain valuable insights into your automation performance with detailed analytics and reporting."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default page;
