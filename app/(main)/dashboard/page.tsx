import { generateInsights } from "@/server/dashboard";
import { getOnBoardingStatus } from "@/server/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/DashboardView";

const page = async () => {
  const { isOnBoarded } = await getOnBoardingStatus();
  if (!isOnBoarded) {
    redirect("/onboarding");
  }

  const { data } = await generateInsights();
  return (
    <div className="container mx-auto">
      <DashboardView insights={data} />
    </div>
  );
};

export default page;
