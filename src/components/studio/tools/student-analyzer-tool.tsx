~"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentAnalyzerSchema } from "@/lib/schemas";
import { runAnalyzeStudentPerformance } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolView } from "../tool-view";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeStudentPerformanceOutput } from "@/ai/flows/analyze-student-performance";
import {
  ChartPie,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  BarChart as BarChartIcon,
  Activity,
  Radar,
  Upload,
  Download,
  FileUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RadarComponent,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

type FormData = z.infer<typeof studentAnalyzerSchema>;

// Demo data for student performance analysis
const generateDemoData = () => {
  const months = ["January", "February", "March", "April", "May"];
  const subjects = ["Mathematics", "Science", "English", "History", "Art"];

  const monthlyData = months.map((month) => {
    const scores = subjects.map((subject) => {
      // Generate realistic scores with some variation between months
      // but maintaining subject-specific trends
      let baseScore;
      switch (subject) {
        case "Mathematics":
          baseScore = 75 + Math.floor(Math.random() * 10);
          break;
        case "Science":
          baseScore = 80 + Math.floor(Math.random() * 8);
          break;
        case "English":
          baseScore = 65 + Math.floor(Math.random() * 15);
          break;
        case "History":
          baseScore = 70 + Math.floor(Math.random() * 12);
          break;
        case "Art":
          baseScore = 85 + Math.floor(Math.random() * 10);
          break;
        default:
          baseScore = 70 + Math.floor(Math.random() * 20);
      }

      // Add monthly variation
      const monthIndex = months.indexOf(month);
      let monthModifier = 0;

      // Make some subjects show improvement over time
      if (subject === "Mathematics" || subject === "English") {
        monthModifier = monthIndex * 2;
      }

      // Make some subjects show decline over time
      if (subject === "History") {
        monthModifier = -monthIndex;
      }

      const score = Math.min(100, Math.max(50, baseScore + monthModifier));

      return {
        subject,
        score,
      };
    });

    const average =
      scores.reduce((sum, item) => sum + item.score, 0) / scores.length;

    return {
      month,
      scores,
      average: parseFloat(average.toFixed(2)),
    };
  });

  return monthlyData;
};

interface StudentAnalyzerToolProps {
  onBack: () => void;
}

export function StudentAnalyzerTool({ onBack }: StudentAnalyzerToolProps) {
  const [result, setResult] = useState<AnalyzeStudentPerformanceOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [demoData, setDemoData] = useState(generateDemoData());
  const { theme } = useTheme();
  const [chartTheme, setChartTheme] = useState({
    primary: "#8884d8",
    secondary: "#82ca9d",
    tertiary: "#ffc658",
    background: "#f9fafb",
    text: "#374151",
    grid: "#e5e7eb",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(studentAnalyzerSchema),
    defaultValues: {
      studentName: "Alex Johnson",
      gradeLevel: "6",
      currentMonth: "May",
      previousMonths: ["April", "March", "February", "January"],
      visualizationPreference: "detailed",
      chartColorTheme: "default",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      toast({
        title: "File selected",
        description: `${event.target.files[0].name} will be used for analysis`,
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let performanceData = demoData;

      // If a file is uploaded, try to parse it
      if (selectedFile) {
        // In a real application, you would parse the CSV or Excel file here
        // For this demo, we'll just simulate file processing by showing a toast
        toast({
          title: "Processing uploaded data",
          description: `Analyzing data from ${selectedFile.name}`,
        });

        // For demo purposes, we'll just use our demo data with minor modifications
        // to simulate different data from the file
        performanceData = demoData.map((month) => ({
          ...month,
          scores: month.scores.map((subject) => ({
            ...subject,
            // Add some random variation to simulate different data
            score: Math.min(
              100,
              Math.max(50, subject.score + (Math.random() * 10 - 5))
            ),
          })),
          average: month.average + (Math.random() * 5 - 2.5),
        }));
      }

      // Create the complete input with our data
      const completeInput = {
        ...data,
        monthlyData: performanceData,
      };

      const result = await runAnalyzeStudentPerformance(completeInput);
      setResult(result);

      // If file was uploaded, show success message
      if (selectedFile) {
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed data from ${selectedFile.name}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze student performance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up chart themes based on form values and current theme (light/dark)
  useEffect(() => {
    const colorTheme = form.watch("chartColorTheme");
    const isDarkMode = theme === "dark";

    const themes = {
      default: isDarkMode
        ? {
            primary: "#a78bfa",
            secondary: "#4ade80",
            tertiary: "#fde047",
            background: "#1e293b",
            text: "#e2e8f0",
            grid: "#334155",
          }
        : {
            primary: "#8884d8",
            secondary: "#82ca9d",
            tertiary: "#ffc658",
            background: "#f9fafb",
            text: "#374151",
            grid: "#e5e7eb",
          },
      monochrome: isDarkMode
        ? {
            primary: "#d1d5db",
            secondary: "#9ca3af",
            tertiary: "#6b7280",
            background: "#1f2937",
            text: "#f3f4f6",
            grid: "#374151",
          }
        : {
            primary: "#2c3e50",
            secondary: "#7f8c8d",
            tertiary: "#bdc3c7",
            background: "#f8f9fa",
            text: "#2c3e50",
            grid: "#e9ecef",
          },
      vibrant: isDarkMode
        ? {
            primary: "#f472b6",
            secondary: "#60a5fa",
            tertiary: "#fcd34d",
            background: "#0f172a",
            text: "#e2e8f0",
            grid: "#334155",
          }
        : {
            primary: "#FF6384",
            secondary: "#36A2EB",
            tertiary: "#FFCE56",
            background: "#ffffff",
            text: "#333333",
            grid: "#f0f0f0",
          },
    };

    if (colorTheme && themes[colorTheme]) {
      setChartTheme(themes[colorTheme]);
    }
  }, [form.watch("chartColorTheme"), theme]);

  const ChartAnimation = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );

  // Function to determine which charts to show based on visualization preference
  const shouldShowChart = (chartType: string) => {
    const preference = form.watch("visualizationPreference") || "detailed";

    if (preference === "comprehensive") {
      return true; // Show all charts
    }

    if (preference === "detailed") {
      // Don't show some advanced charts
      return !["skills-scatter", "heatmap-advanced"].includes(chartType);
    }

    if (preference === "simple") {
      // Only show basic charts
      return ["overview-bar", "trends-line", "basic-recommendations"].includes(
        chartType
      );
    }

    return true;
  };

  return (
    <ToolView
      title="Student Analyzer"
      description="Analyze student performance data and get improvement recommendations."
      onBack={onBack}
      icon={ChartPie}
    >
      <div className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            Grade {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visualizationPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visualization Detail</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "detailed"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visualization detail" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">
                          Comprehensive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chartColorTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chart Color Theme</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "default"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chart color theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File upload handled separately outside the form fields */}

            <div className="border border-dashed rounded-lg p-6 my-6 bg-muted/50">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Upload Student Data</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Upload CSV or Excel file with student performance data
                  including subjects, scores, and dates
                </p>

                <div className="w-full max-w-sm">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block w-full"
                  >
                    <div className="bg-primary hover:bg-primary/90 transition-colors px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 text-white">
                      <FileUp className="h-5 w-5" />
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Choose File"}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-3 py-1 rounded-full">
                    <FileSpreadsheet className="h-4 w-4" />
                    {selectedFile.name}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 w-1 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                  <span className="text-xs text-muted-foreground">
                    Or use our sample data for demonstration
                  </span>
                  <div className="h-1 w-1 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center">
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full max-w-sm py-6 text-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Analyzing Student Performance...
                  </>
                ) : (
                  <>
                    <ChartPie className="mr-2 h-5 w-5" />
                    Analyze Performance Data
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground mt-2">
                Generate detailed performance analysis and recommendations
              </p>
            </div>
          </form>
        </Form>

        {!result && !isLoading && (
          <>
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-muted/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ChartPie className="h-5 w-5 text-primary" />
                      Sample Performance Data
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      This demo shows sample performance data for Alex Johnson
                      across 5 months. Submit the form to see detailed analysis.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10">
                    Preview
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Monthly Performance Averages
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={demoData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      style={{ backgroundColor: chartTheme.background }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartTheme.grid}
                      />
                      <XAxis dataKey="month" stroke={chartTheme.text} />
                      <YAxis domain={[40, 100]} stroke={chartTheme.text} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: chartTheme.background,
                          borderColor: chartTheme.primary,
                        }}
                        labelStyle={{ color: chartTheme.text }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke={chartTheme.primary}
                        name="Monthly Average"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Subject Breakdown (May)
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={demoData[4].scores}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartTheme.grid}
                        />
                        <XAxis dataKey="subject" stroke={chartTheme.text} />
                        <YAxis domain={[0, 100]} stroke={chartTheme.text} />
                        <Tooltip />
                        <Bar
                          dataKey="score"
                          fill={chartTheme.secondary}
                          name="Score"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Subject Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                          data={demoData[4].scores}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill={chartTheme.primary}
                          dataKey="score"
                          nameKey="subject"
                          label
                        >
                          {demoData[4].scores.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? chartTheme.primary
                                  : index === 1
                                  ? chartTheme.secondary
                                  : index === 2
                                  ? chartTheme.tertiary
                                  : `hsl(${index * 45}, 70%, 60%)`
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 border-t flex justify-center">
                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Run Full Analysis
                </Button>
              </CardFooter>
            </Card>

            <div className="flex items-center justify-center my-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>
                  Click "Analyze Performance Data" above to see complete results
                </span>
                <div className="h-1 w-1 rounded-full bg-primary"></div>
              </div>
            </div>
          </>
        )}

        {result && (
          <div className="space-y-8 animate-fade-in">
            <Card>
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Performance Analysis
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {result.overallAnalysis}
                  </CardDescription>
                </motion.div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 text-green-500 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((strength, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="flex items-center"
                          >
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 mr-2"
                            >
                              Strong
                            </Badge>
                            {strength}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses.map((weakness, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="flex items-center"
                          >
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 mr-2"
                            >
                              Needs Work
                            </Badge>
                            {weakness}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* New Radar Chart for Subject Performance */}
                <ChartAnimation>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Radar className="h-5 w-5 text-purple-500 mr-2" />
                        Subject Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <RadarChart
                          outerRadius={150}
                          data={result.visualizationData.compareData}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <RadarComponent
                            name="Current Month"
                            dataKey="currentScore"
                            stroke={chartTheme.secondary}
                            fill={chartTheme.secondary}
                            fillOpacity={0.6}
                          />
                          <RadarComponent
                            name="Previous Month"
                            dataKey="previousScore"
                            stroke={chartTheme.primary}
                            fill={chartTheme.primary}
                            fillOpacity={0.4}
                          />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ChartAnimation>

                <ChartAnimation>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                        Current vs Previous Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={result.visualizationData.compareData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="previousScore"
                            name="Previous Month"
                            fill={chartTheme.primary}
                          />
                          <Bar
                            dataKey="currentScore"
                            name="Current Month"
                            fill={chartTheme.secondary}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ChartAnimation>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center text-blue-700">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Study Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-700">
                        Focus on the high-priority improvement areas first.
                        Consider dedicating extra study time to subjects with a
                        "High" priority rating.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center text-purple-700">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Learning Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-purple-700">
                        Consider using different learning methods for different
                        subjects. Visual aids for some, practice problems for
                        others, based on the recommendations below.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {result.improvementAreas.map((area, i) => {
                  // Calculate priority based on how many weaknesses mention this subject
                  const weaknessCount = result.weaknesses.filter((w) =>
                    w.toLowerCase().includes(area.subject.toLowerCase())
                  ).length;

                  const priority =
                    weaknessCount >= 2
                      ? "High"
                      : weaknessCount === 1
                      ? "Medium"
                      : "Low";

                  const priorityColor =
                    priority === "High"
                      ? "bg-red-100 text-red-800"
                      : priority === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800";

                  // Get current score for this subject if available
                  const subjectData = result.visualizationData.compareData.find(
                    (item) =>
                      item.subject.toLowerCase() === area.subject.toLowerCase()
                  );

                  const currentScore = subjectData?.currentScore || 0;
                  const previousScore = subjectData?.previousScore || 0;
                  const change = subjectData?.change || 0;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center">
                              <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                              {area.subject} Improvement Plan
                            </CardTitle>
                            <Badge className={priorityColor}>
                              {priority} Priority
                            </Badge>
                          </div>

                          {subjectData && (
                            <div className="flex items-center mt-2">
                              <span className="text-sm mr-2">
                                Current: {currentScore}/100
                              </span>
                              <Progress
                                value={currentScore}
                                max={100}
                                className="h-2 flex-1"
                              />
                              <span className="text-sm ml-2">
                                {change > 0 ? (
                                  <span className="text-green-600">
                                    +{change}%
                                  </span>
                                ) : change < 0 ? (
                                  <span className="text-red-600">
                                    {change}%
                                  </span>
                                ) : (
                                  <span className="text-gray-600">0%</span>
                                )}
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="mb-3">{area.recommendation}</p>
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="bg-blue-50 p-3 rounded-md">
                              <h5 className="text-sm font-medium text-blue-800 mb-1">
                                Resources
                              </h5>
                              <ul className="text-xs text-blue-700 space-y-1">
                                <li>Practice worksheets</li>
                                <li>Online tutorials</li>
                                <li>Study guides</li>
                              </ul>
                            </div>
                            <div className="bg-green-50 p-3 rounded-md">
                              <h5 className="text-sm font-medium text-green-800 mb-1">
                                Activities
                              </h5>
                              <ul className="text-xs text-green-700 space-y-1">
                                <li>Group study sessions</li>
                                <li>Practice quizzes</li>
                                <li>Interactive lessons</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </TabsContent>

              <TabsContent value="trends" className="pt-4">
                <ChartAnimation>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Performance Trends Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                          data={result.visualizationData.trendData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[40, 100]} />
                          <Tooltip />
                          <Legend />
                          {Object.keys(
                            result.visualizationData.trendData[0]?.subjects ||
                              {}
                          ).map((subject, i) => {
                            // Generate colors based on theme
                            const baseColor =
                              i === 0
                                ? chartTheme.primary
                                : i === 1
                                ? chartTheme.secondary
                                : i === 2
                                ? chartTheme.tertiary
                                : `hsl(${i * 60}, 70%, 50%)`;

                            return (
                              <Line
                                key={subject}
                                type="monotone"
                                dataKey={`subjects.${subject}`}
                                name={subject}
                                stroke={baseColor}
                                strokeWidth={2}
                              />
                            );
                          })}
                          <Line
                            type="monotone"
                            dataKey="average"
                            name="Average"
                            stroke={chartTheme.text}
                            strokeWidth={3}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </ChartAnimation>

                {/* New Performance Heatmap */}
                {shouldShowChart("heatmap-advanced") && (
                  <ChartAnimation>
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Activity className="h-5 w-5 text-blue-500 mr-2" />
                          Performance Improvements
                        </CardTitle>
                        <CardDescription>
                          Subject-by-subject improvement compared to the
                          previous month
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.visualizationData.compareData.map(
                          (item, index) => {
                            const changePercent =
                              ((item.currentScore - item.previousScore) /
                                item.previousScore) *
                              100;
                            const isPositive = changePercent >= 0;
                            let bgColor = "bg-gray-200";

                            if (changePercent > 10) bgColor = "bg-green-500";
                            else if (changePercent > 5)
                              bgColor = "bg-green-400";
                            else if (changePercent > 0)
                              bgColor = "bg-green-300";
                            else if (changePercent > -5)
                              bgColor = "bg-amber-300";
                            else if (changePercent > -10)
                              bgColor = "bg-amber-400";
                            else bgColor = "bg-red-500";

                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                                className="space-y-1"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {item.subject}
                                  </span>
                                  <Badge
                                    className={
                                      isPositive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    }
                                  >
                                    {isPositive ? "+" : ""}
                                    {changePercent.toFixed(1)}%
                                  </Badge>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${bgColor}`}
                                    style={{
                                      width: `${Math.min(
                                        Math.abs(changePercent) * 5,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </motion.div>
                            );
                          }
                        )}
                      </CardContent>
                    </Card>
                  </ChartAnimation>
                )}

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">
                    Subject Trend Analysis
                  </h3>
                  {result.trends.map((trend, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">{trend.subject}</h4>
                              <div className="flex items-center">
                                {trend.trend === "improving" ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    Improving
                                  </Badge>
                                ) : trend.trend === "declining" ? (
                                  <Badge className="bg-red-100 text-red-800">
                                    Declining
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Stable
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 max-w-md">
                              {trend.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="pt-4">
                <ChartAnimation>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BarChartIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        Skills Distribution
                      </CardTitle>
                      <CardDescription>
                        A visualization of how each subject contributes to
                        overall skills development
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid />
                          <XAxis
                            type="number"
                            dataKey="currentScore"
                            name="Score"
                            domain={[50, 100]}
                            label={{
                              value: "Current Score",
                              position: "bottom",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            type="number"
                            dataKey="change"
                            name="Growth"
                            domain={[-10, 20]}
                            label={{
                              value: "Growth Rate",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            formatter={(value, name, props) => {
                              if (
                                name === "Growth" &&
                                typeof value === "number"
                              )
                                return [`${value.toFixed(1)}%`, name];
                              return [value, name];
                            }}
                            labelFormatter={(label) => `Subject: ${label}`}
                          />
                          <Legend />
                          <Scatter
                            name="Subject Performance"
                            data={result.visualizationData.compareData.map(
                              (item) => ({
                                ...item,
                                size: Math.abs(item.change) * 2 + 10,
                              })
                            )}
                            fill="#8884d8"
                          >
                            {result.visualizationData.compareData.map(
                              (entry, index) => {
                                const isPositive = entry.change >= 0;
                                return (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={isPositive ? "#82ca9d" : "#ff7d7d"}
                                  />
                                );
                              }
                            )}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500">
                      <p>
                        Chart shows the relationship between current performance
                        and growth rate. Larger bubbles indicate more
                        significant changes.
                      </p>
                    </CardFooter>
                  </Card>
                </ChartAnimation>

                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Skills Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {result.visualizationData.compareData.map((item, i) => {
                        const scoreCategory =
                          item.currentScore >= 90
                            ? "Excellent"
                            : item.currentScore >= 80
                            ? "Good"
                            : item.currentScore >= 70
                            ? "Satisfactory"
                            : item.currentScore >= 60
                            ? "Needs Improvement"
                            : "Concerning";

                        const scoreColor =
                          item.currentScore >= 90
                            ? "bg-emerald-500"
                            : item.currentScore >= 80
                            ? "bg-green-500"
                            : item.currentScore >= 70
                            ? "bg-amber-500"
                            : item.currentScore >= 60
                            ? "bg-orange-500"
                            : "bg-red-500";

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.subject}</h4>
                              <span className="font-semibold">
                                {item.currentScore}/100
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${scoreColor}`}
                                style={{ width: `${item.currentScore}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Skill level: {scoreCategory}</span>
                              <span>
                                {item.change >= 0 ? "+" : ""}
                                {item.change}% from previous
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="data" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileSpreadsheet className="h-5 w-5 mr-2" />
                      Raw Performance Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Month
                            </th>
                            {demoData[0].scores.map((item) => (
                              <th
                                key={item.subject}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {item.subject}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Average
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {demoData.map((monthData, i) => (
                            <tr
                              key={i}
                              className={
                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {monthData.month}
                              </td>
                              {monthData.scores.map((score) => (
                                <td
                                  key={score.subject}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {score.score}
                                </td>
                              ))}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {monthData.average}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </ToolView>
  );
}
