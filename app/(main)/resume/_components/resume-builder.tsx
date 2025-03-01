"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/schema/schema";
import { useFetch } from "@/hooks/useFetch";
import { improveWithAi, saveResume } from "@/server/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import MDEditor, { PreviewType } from "@uiw/react-md-editor";
// @ts-ignore
import html2pdf from "html2pdf.js";

interface EntryProp {
  title: string;
  organization: string;
  startDate: string;
  description: string;
  endDate?: string | undefined;
  current?: boolean | undefined;
}

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState<PreviewType>("preview");
  const [markdownContent, setMarkDownContent] = useState(initialContent);
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    data: saveResult,
    loading: isSaving,
    fetchData: saveResumeFn,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) return setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getMarkdownContent();
      setMarkDownContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  const getContactInforInMD = () => {
    const { contactInfo } = formValues;

    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user!.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getEntriesIntoMd = (entries: EntryProp[], type: string) => {
    if (!entries?.length) return "";

    return (
      `## ${type}\n\n` +
      entries
        .map((entry) => {
          const dateRange = entry.current
            ? `${entry.startDate} - Present`
            : `${entry.startDate} - ${entry.endDate}`;

          return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
        })
        .join("\n\n")
    );
  };

  const getMarkdownContent = () => {
    const { summary, skills, education, experience, projects } = formValues;
    return [
      getContactInforInMD(),
      summary && `## Professional Summary \n\n ${summary}`,
      skills && `## Skills\n\n ${skills}`,
      getEntriesIntoMd(experience, "Work Experience"),
      getEntriesIntoMd(education, "Education"),
      getEntriesIntoMd(projects, "Projects"),
    ]
      .filter(Boolean)
      .join(`\n\n`);
  };

  // improve functionality for summary
  const {
    data: improveResult,
    loading: isImproving,
    fetchData: improveSummaryFn,
    error: improveError,
  } = useFetch(improveWithAi);

  useEffect(() => {
    if (improveResult?.data && !isImproving) {
      setValue("summary", improveResult.data);
      toast.success("Summary improved successfully");
    }
    if (improveError) {
      toast.error(improveError || "Failed to improve summary");
    }
  }, [improveResult, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const summary = watch("summary");
    if (!summary) {
      toast.error("Please enter a description first");
    }

    await improveSummaryFn({
      current: summary,
      type: "summary",
    });
  };

  useEffect(() => {
    if (saveResult?.resume && !isSaving) {
      toast.success(saveResult.message);
    }

    if (saveError) {
      toast.error(saveError || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const onSubmit = async () => {
    try {
      await saveResumeFn(markdownContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: `${user?.fullName || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // New Promise-based usage:
      await html2pdf().from(element).set(opt).save();
      toast.success("Pdf downloaded successfully");
    } catch (error) {
      toast.error(
        `Unable to download pdf ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button variant="destructive" onClick={onSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePdf} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading Pdf...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={() =>
          setActiveTab((prev) => (prev === "edit" ? "preview" : "edit"))
        }
      >
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    // defaultValue={"https://linkedin.com/in/"}
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                    // defaultValue={"https://twitter.com/"}
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !watch("summary")}
              >
                {isImproving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                  />
                )}
              />
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"experience"}
                    onChange={field.onChange}
                    entries={field.value}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"education"}
                    onChange={field.onChange}
                    entries={field.value}
                  />
                )}
              />
              {errors.education && (
                <p className="text-red-500 text-sm">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"projects"}
                    onChange={field.onChange}
                    entries={field.value}
                  />
                )}
              />
              {errors.education && (
                <p className="text-red-500 text-sm">
                  {errors.education.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant={"link"}
            type="button"
            className="mb-2"
            onClick={() => {
              setResumeMode(resumeMode === "preview" ? "edit" : "preview");
            }}
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>

          {resumeMode === "edit" && (
            <div className="flex gap-2 border-2 mb-2 border-yellow-500 text-yellow-500 p-3 rounded-md items-center">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data
              </span>
            </div>
          )}

          <div className="rounded-lg border">
            <MDEditor
              value={markdownContent}
              onChange={(value) => setMarkDownContent(value || "")}
              height={800}
              preview={resumeMode}
            />
          </div>

          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={markdownContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
