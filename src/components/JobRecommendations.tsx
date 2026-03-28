import { motion } from 'framer-motion';
import { Briefcase, Star } from 'lucide-react';
import type { JobRecommendation } from '@/types/analysis';

interface JobRecommendationsProps {
  jobs: JobRecommendation[];
}

const JobRecommendations = ({ jobs }: JobRecommendationsProps) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Job Recommendations</h2>
          <p className="text-muted-foreground">Roles that match your skills and experience</p>
        </motion.div>

        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20">
                    <Star className="w-3 h-3 text-accent" />
                    <span className="text-xs font-bold text-accent">{job.matchPercentage}%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 5).map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">No job recommendations available. Try providing a more detailed resume or job description.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobRecommendations;
