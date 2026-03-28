import { useState, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import InputSection from '@/components/InputSection';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import JobRecommendations from '@/components/JobRecommendations';
import SalaryInsightsSection from '@/components/SalaryInsights';
import SuccessRoadmap from '@/components/SuccessRoadmap';
import OptimizedResume from '@/components/OptimizedResume';
import CareerChatbot from '@/components/CareerChatbot';
import type { AnalysisResult } from '@/types/analysis';

/** Safely convert any value to a string (handles objects the AI may return) */
const toStr = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') return Object.values(v).join(' — ');
  return String(v ?? '');
};

/** Normalize AI response so every field that should be a string[] is a string[] */
const normalizeResult = (r: AnalysisResult): AnalysisResult => ({
  ...r,
  extractedSkills: (r.extractedSkills ?? []).map(toStr),
  requiredSkills: (r.requiredSkills ?? []).map(toStr),
  missingSkills: (r.missingSkills ?? []).map(toStr),
  suggestions: (r.suggestions ?? []).map(toStr),
  salaryInsights: {
    ...r.salaryInsights,
    factors: (r.salaryInsights?.factors ?? []).map(toStr),
  },
  roadmap: (r.roadmap ?? []).map((step) => ({
    ...step,
    skill: toStr(step.skill),
    explanation: toStr(step.explanation),
    resources: (step.resources ?? []).map((res: any) => ({
      title: toStr(res.title ?? res.project ?? res.name ?? ''),
      url: typeof res.url === 'string' ? res.url : '#',
      platform: toStr(res.platform ?? res.source ?? ''),
    })),
  })),
  optimizedResumeSections: {
    summary: toStr(r.optimizedResumeSections?.summary),
    skills: (r.optimizedResumeSections?.skills ?? []).map(toStr),
    experience: (r.optimizedResumeSections?.experience ?? []).map(toStr),
    keywords: (r.optimizedResumeSections?.keywords ?? []).map(toStr),
  },
});

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState('');
  const uploadRef = useRef<HTMLDivElement>(null!);
  const jobDescRef = useRef<HTMLDivElement>(null!);
  const resultsRef = useRef<HTMLDivElement>(null!);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result: AnalysisResult, text: string) => {
    setAnalysisResult(normalizeResult(result));
    setResumeText(text);
    setTimeout(() => scrollTo(resultsRef), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onUploadClick={() => scrollTo(uploadRef)}
        onJobDescClick={() => scrollTo(jobDescRef)}
      />

      <InputSection
        onAnalysisComplete={handleAnalysisComplete}
        uploadRef={uploadRef}
        jobDescRef={jobDescRef}
      />

      {analysisResult && (
        <div ref={resultsRef}>
          <AnalysisDashboard result={analysisResult} />
          <JobRecommendations jobs={analysisResult.jobRecommendations} />
          <SalaryInsightsSection salary={analysisResult.salaryInsights} />
          <SuccessRoadmap roadmap={analysisResult.roadmap} />
          <OptimizedResume sections={analysisResult.optimizedResumeSections} originalText={resumeText} />
        </div>
      )}

      <CareerChatbot />
    </div>
  );
};

export default Index;
