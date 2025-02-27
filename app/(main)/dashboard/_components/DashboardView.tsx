import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Chart from "./Chart";

type SalaryRange = {
  max: number;
  min: number;
  role: string;
  median: number;
  location: string;
};

export type Insights = {
  id: string;
  industry: string;
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: string;
  topSkills: string[];
  marketOutlook: string;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string; // Or Date if parsed
  nextUpdate: string; // Or Date if parsed
};

export type InsightsProp = {
  insights: Insights | undefined;
};

const DashboardView = ({ insights }: InsightsProp) => {
  const salaryData = insights?.salaryRanges.map((curr) => ({
    max: curr.max / 1000,
    min: curr.min / 1000,
    role: curr.role,
    median: curr.median / 1000,
  }));

  const getDemandColorLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";

      case "medium":
        return "bg-yellow-500";

      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const outlookColor = getMarketOutlookInfo(
    insights?.marketOutlook as string
  ).color;

  const OutlookIcon = getMarketOutlookInfo(
    insights?.marketOutlook as string
  ).icon;

  const lastUpdatedDate = format(
    new Date(insights?.lastUpdated || ""),
    "dd/MM/yy"
  );
  const nextUpdateDate = formatDistanceToNow(
    new Date(insights?.nextUpdate || ""),
    { addSuffix: true }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={"outline"}>last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`w-5 h-5 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className={`w-5 h-5 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights?.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className={`w-5 h-5 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.demandLevel}</div>
            <div
              className={`mt-2 h-2 w-full rounded-full ${getDemandColorLevel(
                insights?.demandLevel as string
              )}`}
            ></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className={`w-5 h-5 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights?.topSkills.map((skill) => {
                return (
                  <Badge
                    key={skill}
                    variant={"secondary"}
                    className="font-medium"
                  >
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Chart salaryData={salaryData ?? []} />

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/25 border-2 border-muted">
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights?.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/25 border-2 border-muted">
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights?.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
