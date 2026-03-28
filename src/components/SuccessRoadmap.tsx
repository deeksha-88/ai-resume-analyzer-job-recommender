import { motion } from 'framer-motion';
import { Map, ExternalLink, BookOpen } from 'lucide-react';
import type { RoadmapStep } from '@/types/analysis';

interface SuccessRoadmapProps {
  roadmap: RoadmapStep[];
}

const SuccessRoadmap = ({ roadmap }: SuccessRoadmapProps) => {

  // ✅ ALWAYS GENERATE WORKING LINKS
  const generateLinks = (title: string) => {
    const query = encodeURIComponent(title);

    return [
      {
        title: "Learn on W3Schools",
        platform: "W3Schools",
        // ✅ Google-based W3Schools search (always works)
        url: `https://www.google.com/search?q=site:w3schools.com+${query}`
      },
      {
        title: "Course on Coursera",
        platform: "Coursera",
        // ✅ Coursera search (reliable)
        url: `https://www.coursera.org/search?query=${query}`
      }
    ];
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Success Roadmap
          </h2>
          <p className="text-muted-foreground">
            Your personalized learning path to close skill gaps
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20" />

          <div className="space-y-8">
            {roadmap.map((step, i) => {

              // ❌ IGNORE AI LINKS COMPLETELY
              const safeResources = generateLinks(step.skill);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Step circle */}
                  <div className="absolute left-3 top-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {step.step}
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        {step.skill}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {step.explanation}
                    </p>

                    <div className="space-y-2">
                      {safeResources.map((res, j) => (
                        <a
                          key={j}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group"
                        >
                          <Map className="w-4 h-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {res.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {res.platform}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessRoadmap;