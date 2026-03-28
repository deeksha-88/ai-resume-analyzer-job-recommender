import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const CHART_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899', '#10b981'];

const AnalysisDashboard = ({ result }: AnalysisDashboardProps) => {
  const barData = result.skillScores.map((s) => ({
    name: s.skill.length > 12 ? s.skill.slice(0, 12) + '…' : s.skill,
    'Your Level': s.userLevel,
    'Required': s.requiredLevel,
  }));

  const pieData = [
    { name: 'Match', value: result.matchScore },
    { name: 'Gap', value: 100 - result.matchScore },
  ];

  const radarData = result.skillScores.slice(0, 8).map((s) => ({
    skill: s.skill.length > 10 ? s.skill.slice(0, 10) + '…' : s.skill,
    user: s.userLevel,
    required: s.requiredLevel,
  }));

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Resume Analysis</h2>
          <p className="text-muted-foreground">AI-powered insights based on your resume and target role</p>
        </motion.div>

        {/* Score + Skills Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center glow-primary"
          >
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-5xl font-extrabold gradient-text mb-2">{result.matchScore}%</div>
            <p className="text-muted-foreground text-sm">Match Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <CheckCircle className="w-6 h-6 text-accent mb-3" />
            <h3 className="font-semibold text-foreground mb-3">Skills Found</h3>
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <AlertTriangle className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="font-semibold text-foreground mb-3">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.length > 0 ? result.missingSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
                  {skill}
                </span>
              )) : (
                <p className="text-sm text-muted-foreground">Great job! No missing skills detected.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-secondary-foreground text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Skills vs Requirements</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'hsl(215 15% 55%)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(220 25% 10%)', border: '1px solid hsl(220 20% 18%)', borderRadius: '8px', color: 'hsl(210 40% 96%)' }} />
                <Bar dataKey="Your Level" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Required" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Match vs Gap</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={{ stroke: 'hsl(210 40% 96%)' }} style={{ fontSize: 13 }} fill="hsl(210 40% 96%)">
                  <Cell fill="#6366f1" />
                  <Cell fill="#374151" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(220 25% 10%)', border: '1px solid hsl(220 20% 18%)', borderRadius: '8px', color: 'hsl(210 40% 96%)' }} itemStyle={{ color: 'hsl(210 40% 96%)' }} labelStyle={{ color: 'hsl(210 40% 96%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="font-semibold text-foreground mb-4">Skill Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 20% 18%)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: 'hsl(215 15% 55%)' }} />
                <Radar name="Your Level" dataKey="user" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Radar name="Required" dataKey="required" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Legend wrapperStyle={{ color: 'hsl(210 40% 96%)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisDashboard;
