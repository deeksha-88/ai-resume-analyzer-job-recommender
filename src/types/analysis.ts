export interface SkillScore {
  skill: string;
  userLevel: number;
  requiredLevel: number;
}

export interface JobRecommendation {
  title: string;
  requiredSkills: string[];
  matchPercentage: number;
  description: string;
}

export interface SalaryInsights {
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  currency: string;
  experienceLevel: string;
  factors: string[];
}

export interface RoadmapResource {
  title: string;
  url: string;
  platform: string;
}

export interface RoadmapStep {
  step: number;
  skill: string;
  explanation: string;
  resources: RoadmapResource[];
}

export interface OptimizedResumeSections {
  summary: string;
  skills: string[];
  experience: string[];
  keywords: string[];
}

export interface AnalysisResult {
  isValidResume: boolean;
  validationMessage?: string;
  matchScore: number;
  extractedSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  skillScores: SkillScore[];
  suggestions: string[];
  jobRecommendations: JobRecommendation[];
  salaryInsights: SalaryInsights;
  roadmap: RoadmapStep[];
  optimizedResumeSections: OptimizedResumeSections;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
