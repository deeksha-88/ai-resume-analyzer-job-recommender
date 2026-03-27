import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Award } from 'lucide-react';
import type { SalaryInsights as SalaryInsightsType } from '@/types/analysis';

interface SalaryInsightsProps {
  salary: SalaryInsightsType;
}

const SalaryInsightsSection = ({ salary }: SalaryInsightsProps) => {
  const formatSalary = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Salary Insights</h2>
          <p className="text-muted-foreground">Estimated compensation based on your profile</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 text-center"
          >
            <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Minimum</p>
            <p className="text-2xl font-bold text-foreground">{formatSalary(salary.minSalary)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 text-center glow-accent"
          >
            <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-3xl font-extrabold gradient-text">{formatSalary(salary.averageSalary)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Maximum</p>
            <p className="text-2xl font-bold text-foreground">{formatSalary(salary.maxSalary)}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Experience Level: {salary.experienceLevel}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {salary.factors.map((f, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SalaryInsightsSection;
