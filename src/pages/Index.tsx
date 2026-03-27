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
    setAnalysisResult(result);
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
