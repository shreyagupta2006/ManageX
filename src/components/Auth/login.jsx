import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, User, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const Login = ({ handleLogin }) => {
  const { theme } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add brief artificial delay for realistic premium visual feel
    await new Promise(resolve => setTimeout(resolve, 800));
    handleLogin(email, password);
    setIsSubmitting(false);
  };

  const selectDemoUser = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="w-full max-w-[440px] rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-2xl backdrop-blur-md"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-lg mb-4 cursor-pointer"
          >
            <Sparkles className="h-6 w-6 text-indigo-500" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Sign in to Manage<span className="text-indigo-500 font-medium">X</span>
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-semibold tracking-tight uppercase">
            Smart Workforce Management Platform
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 leading-normal max-w-xs">
            Organize assignments, coordinate employee schedules, and track task timelines in real time.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@workspace.com"
                className="w-full h-11 rounded-lg border border-border bg-transparent pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-zinc-400/80 focus:border-ring focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-border bg-transparent pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-zinc-400/80 focus:border-ring focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-2 text-sm font-semibold cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Authenticating...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Separator Line */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] font-semibold uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              Demo Credentials
            </span>
          </div>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => selectDemoUser('admin@me.com', '123')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-zinc-50/50 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer group"
          >
            <Shield className="h-4.5 w-4.5 text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 mb-1.5 transition-colors" />
            <span className="text-[10px] font-bold text-foreground">Admin Demo</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">admin@me.com</span>
          </button>
          
          <button
            onClick={() => selectDemoUser('e@e.com', '123')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-zinc-50/50 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer group"
          >
            <User className="h-4.5 w-4.5 text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 mb-1.5 transition-colors" />
            <span className="text-[10px] font-bold text-foreground">Employee Demo</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">e@e.com (Arjun)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
