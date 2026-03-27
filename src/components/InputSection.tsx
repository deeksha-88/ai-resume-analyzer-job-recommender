import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { extractTextFromFile } from '@/lib/fileExtractor';
import { analyzeResume } from '@/lib/api';
import type { AnalysisResult } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';

interface InputSectionProps {
  onAnalysisComplete: (result: AnalysisResult, resumeText: string) => void;
  uploadRef: React.RefObject<HTMLDivElement>;
  jobDescRef: React.RefObject<HTMLDivElement>;
}

const InputSection = ({ onAnalysisComplete, uploadRef, jobDescRef }: InputSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext || '')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setFile(selectedFile);
    setError('');

    try {
      setLoadingMsg('Extracting text from resume...');
      setIsLoading(true);
      const text = await extractTextFromFile(selectedFile);
      setResumeText(text);
      setIsLoading(false);
      setLoadingMsg('');
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from file');
      setIsLoading(false);
      setLoadingMsg('');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(droppedFile);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a target job description.');
      return;
    }

    setError('');
    setIsLoading(true);
    setLoadingMsg('Analyzing Resume... This may take a moment.');

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      
      if (!result.isValidResume) {
        setError(result.validationMessage || 'The uploaded file does not appear to be a valid resume. Please upload a document containing education, skills, experience, or projects.');
        setIsLoading(false);
        setLoadingMsg('');
        return;
      }

      onAnalysisComplete(result, resumeText);
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message,
        variant: "destructive",
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingMsg('');
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Get Started</h2>
          <p className="text-muted-foreground">Upload your resume and describe your target role</p>
        </motion.div>

        {/* Upload Area */}
        <div ref={uploadRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Upload Resume</h3>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => { setFile(null); setResumeText(''); }}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-12 hover:border-primary/50 transition-colors flex flex-col items-center gap-3 cursor-pointer"
              >
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Drop your resume here or <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOCX</p>
              </button>
            )}
          </motion.div>
        </div>

        {/* Job Description */}
        <div ref={jobDescRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Target Job Description</h3>
            </div>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're targeting..."
              className="min-h-[160px] bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-lg px-12 py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {loadingMsg}
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InputSection;
