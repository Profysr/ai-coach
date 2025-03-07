"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({
  salaryData,
}: {
  salaryData: {
    min: number;
    max: number;
    median: number;
    role: string;
  }[];
}) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Salary Ranges by Role</CardTitle>
        <CardDescription>
          Displaying minimum, median, and maximum salaries (in thousands)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 w-full md:p-4 lg:p-6">
        <div className="h-[420px] w-full">
          <ResponsiveContainer>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="role"
                tick={{ fontSize: 12 }}
                angle={-25}
                textAnchor="middle"
                tickMargin={10}
                tickFormatter={(value: string) => {
                  const truncatedValue = value.split(" ")[0];
                  return truncatedValue.length < value.length
                    ? `${truncatedValue}...`
                    : truncatedValue;
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-muted border rounded-sm p-2 shadow-sm space-x-2">
                        <p className="font-medium text-sm">{label}</p>
                        {payload.map((item) => (
                          <p key={item.name} className="text-xs my-1">
                            {item.name}: ${item.value}K
                          </p>
                        ))}
                      </div>
                    );
                  }
                }}
              />

              <Bar
                dataKey="min"
                fill="#e63946"
                name="Min Salary (K)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="median"
                fill="#edae49"
                name="Median Salary (K)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="max"
                fill="#3376bd"
                name="Max Salary (K)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
