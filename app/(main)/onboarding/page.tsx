import React from "react";
import OnboardingForm from "./_components/onboarding-form";
import { industries } from "@/data/industries";
import { getOnBoardingStatus } from "@/server/user";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const { isOnBoarded } = await getOnBoardingStatus();

  if (isOnBoarded) {
    redirect("/dashboard");
  }

  return <OnboardingForm industries={industries} />;
};

export default OnBoardingPage;
