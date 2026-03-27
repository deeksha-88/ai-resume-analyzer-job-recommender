import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onUploadClick: () => void;
  onJobDescClick: () => void;
}

const HeroSection = ({ onUploadClick, onJobDescClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">AI-Powered Career Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-foreground">AI Resume</span>
            <br />
            <span className="gradient-text">Analyzer & Job</span>
            <br />
            <span className="text-foreground">Recommender</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Upload your resume, define your target role, and get instant AI-powered analysis 
            with skill gap insights, job matches, salary data, and a personalized learning roadmap.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={onUploadClick} className="text-lg px-8 py-6">
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </Button>
            <Button variant="heroOutline" size="lg" onClick={onJobDescClick} className="text-lg px-8 py-6">
              <FileText className="w-5 h-5 mr-2" />
              Enter Job Description
            </Button>
          </div>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {['Skill Analysis', 'Job Matching', 'Salary Insights', 'Learning Roadmap', 'AI Chatbot'].map((feature) => (
            <span key={feature} className="px-4 py-2 rounded-lg glass text-sm text-muted-foreground">
              {feature}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
