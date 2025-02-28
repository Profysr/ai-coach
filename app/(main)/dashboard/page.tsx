import { generateInsights } from "@/server/dashboard";
import { getOnBoardingStatus } from "@/server/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/DashboardView";

type SalaryRange = {
  max: number;
  min: number;
  role: string;
  median: number;
  location: string;
};

interface IndustryInsights {
  id: string;
  marketOutlook: string;
  growthRate: number;
  demandLevel: string;
  industry: string;
  salaryRanges: SalaryRange[];
  topSkills: string[];
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: Date;
  nextUpdate: Date;
}

const DashboardPage = async () => {
  const { isOnBoarded } = await getOnBoardingStatus();
  if (!isOnBoarded) {
    redirect("/onboarding");
  }

  const { data } = await generateInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={data as IndustryInsights} />
    </div>
  );
};

export default DashboardPage;
