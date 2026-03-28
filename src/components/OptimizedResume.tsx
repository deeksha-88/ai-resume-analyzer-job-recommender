import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OptimizedResumeSections } from '@/types/analysis';

interface OptimizedResumeProps {
  sections: OptimizedResumeSections;
  originalText: string;
}

const OptimizedResume = ({ sections, originalText }: OptimizedResumeProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const mergedResumeText = (() => {
    const skillsLine = sections.skills.length > 0 ? `\n\nSKILLS (Enhanced): ${sections.skills.join(', ')}` : '';
    const keywordsLine = sections.keywords.length > 0 ? `\n\nATS KEYWORDS: ${sections.keywords.join(', ')}` : '';
    const summaryLine = sections.summary ? `\n\nPROFESSIONAL SUMMARY:\n${sections.summary}` : '';
    const experienceLine = sections.experience.length > 0 ? `\n\nEXPERIENCE HIGHLIGHTS:\n${sections.experience.map(e => `• ${e}`).join('\n')}` : '';
    return originalText + summaryLine + skillsLine + experienceLine + keywordsLine;
  })();

  const generatePDF = () => {
    setIsGenerating(true);
    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
  h1 { color: #1a1a2e; font-size: 24px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
  h2 { color: #6366f1; font-size: 18px; margin-top: 24px; }
  .skills { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: #eef2ff; color: #4338ca; padding: 4px 12px; border-radius: 16px; font-size: 14px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 8px; }
  .keywords { background: #f0fdf4; padding: 16px; border-radius: 8px; margin-top: 16px; }
  .content { white-space: pre-wrap; font-size: 14px; line-height: 1.7; }
</style>
</head>
<body>
<h1>Optimized Resume</h1>
<div class="content">${mergedResumeText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildResumeContent = (s: OptimizedResumeSections, original: string): string => {
    let html = '<h1>Optimized Resume</h1>';
    html += '<h2>Professional Summary</h2>';
    html += `<p>${s.summary}</p>`;
    html += '<h2>Skills</h2><div class="skills">';
    s.skills.forEach((skill) => { html += `<span class="skill-tag">${skill}</span>`; });
    html += '</div>';
    html += '<h2>Experience Highlights</h2><ul>';
    s.experience.forEach((exp) => { html += `<li>${exp}</li>`; });
    html += '</ul>';
    html += '<div class="keywords"><h2>ATS Keywords to Include</h2><div class="skills">';
    s.keywords.forEach((kw) => { html += `<span class="skill-tag">${kw}</span>`; });
    html += '</div></div>';
    html += '<h2>Original Resume</h2>';
    html += `<div class="original">${original}</div>`;
    return html;
  };

  return (
    <section id="optimized-resume" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Optimized Resume</h2>
          <p className="text-muted-foreground">AI-improved version with ATS optimization</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {/* Original Resume Toggle */}
          <div>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-2"
            >
              {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showOriginal ? 'Hide' : 'Show'} Original Resume
            </button>
            {showOriginal && (
              <div className="bg-secondary rounded-xl p-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Your Uploaded Resume</p>
                <pre className="text-sm text-secondary-foreground whitespace-pre-wrap font-sans">{originalText}</pre>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" /> Professional Summary
            </h3>
            <p className="text-sm text-secondary-foreground bg-secondary p-4 rounded-xl">{sections.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">Optimized Skills</h3>
            <div className="flex flex-wrap gap-2">
              {sections.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">Experience Highlights</h3>
            <ul className="space-y-2">
              {sections.experience.map((e, i) => (
                <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">ATS Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {sections.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">{kw}</span>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <Button variant="glow" size="lg" onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Optimized Resume
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OptimizedResume;
