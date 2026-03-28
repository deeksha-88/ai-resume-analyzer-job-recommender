import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Upload, Briefcase, DollarSign, Map, FileText, Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiresResults: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '#hero', icon: LayoutDashboard, requiresResults: false },
  { label: 'Upload Resume', href: '#upload', icon: Upload, requiresResults: false },
  { label: 'Analysis', href: '#analysis', icon: FileText, requiresResults: true },
  { label: 'Job Recommendations', href: '#job-recommendations', icon: Briefcase, requiresResults: true },
  { label: 'Salary Insights', href: '#salary-insights', icon: DollarSign, requiresResults: true },
  { label: 'Roadmap', href: '#roadmap', icon: Map, requiresResults: true },
];

interface NavigationBarProps {
  hasResults: boolean;
}

const NavigationBar = ({ hasResults }: NavigationBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const visibleItems = navItems.filter((item) => !item.requiresResults || hasResults);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-sm font-bold gradient-text">ResumeAI</span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {visibleItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item.href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-border/50 px-4 py-3 space-y-1"
        >
          {visibleItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item.href)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavigationBar;
