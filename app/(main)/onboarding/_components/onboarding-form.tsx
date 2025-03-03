"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onBoardingSchema } from "@/schema/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { UpdateUser } from "@/server/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Industry {
  id: string;
  name: string;
  subIndustries: string[];
}

export interface OnSubmitValues {
  industry: string;
  subIndustry: string;
  experience: number;
  bio?: string;
  skills?: string[];
}

const OnboardingForm = ({ industries }: { industries: Industry[] }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );

  const { data: response, loading, fetchData } = useFetch(UpdateUser);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnSubmitValues>({ resolver: zodResolver(onBoardingSchema) });

  const watchIndustry = watch("industry");

  // handler functions
  const onSubmit = async (data: OnSubmitValues) => {
    const formattedIndustry = `${data.industry}-${data.subIndustry}`
      .toLowerCase()
      .replace(/ /g, "-");
    await fetchData({ ...data, industry: formattedIndustry });
  };

  useEffect(() => {
    if (!loading && response?.success === true) {
      toast.success(response.message);
      router.push("/dashboard");
      router.refresh();
    }
  }, [loading, response, router]);

  return (
    <div className="flex justify-center items-center bg-muted/75">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Add specialization in your profile to get industry insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Select Industry  */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(val) => {
                  setValue("industry", val);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === val) || null
                  );
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Industries" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {industries.map((curr) => {
                    return (
                      <SelectItem key={curr.id} value={curr.id}>
                        {curr.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Select Sub Industry */}
            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select onValueChange={(val) => setValue("subIndustry", val)}>
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="e.g Software Engineering" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {selectedIndustry?.subIndustries.map((curr) => {
                      return (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Enter Your Experience</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                placeholder="Enter your Experience in Years"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skill */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g Python, Javascript, NodeJs, React"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Seperate skills with a comma
              </p>

              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us something special about yourself"
                className="h-32"
                {...register("bio")}
              />

              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Saving...
                </>
              ) : (
                "Complete Your Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
