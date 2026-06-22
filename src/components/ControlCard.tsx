import React from 'react';
import { Snowflake, Sparkles, RefreshCw, Clock, BarChart3, HelpCircle, Activity } from 'lucide-react';
import { AnimationType, AnimationStats } from '../types';

interface ControlCardProps {
  activeAnimation: AnimationType;
  stats: AnimationStats;
  onTriggerSnowflakes: () => void;
  onTriggerBalloons: () => void;
  onTriggerConfetti: () => void;
  onReset: () => void;
  timeLeft: number; // in seconds
}

export default function ControlCard({
  activeAnimation,
  stats,
  onTriggerSnowflakes,
  onTriggerBalloons,
  onTriggerConfetti,
  onReset,
  timeLeft,
}: ControlCardProps) {
  // Simple timestamp formatter
  const formatTimestamp = (date: Date | null) => {
    if (!date) return 'No activity';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getSystemStatusMessage = () => {
    switch (activeAnimation) {
      case 'snowflakes':
        return {
          text: `Snowfall active (${timeLeft.toFixed(1)}s)`,
          pulse: 'bg-sky-400',
        };
      case 'balloons':
        return {
          text: `Balloons launched (${timeLeft.toFixed(1)}s)`,
          pulse: 'bg-fuchsia-400',
        };
      case 'confetti':
        return {
          text: `Confetti active (${timeLeft.toFixed(1)}s)`,
          pulse: 'bg-rose-400',
        };
      default:
        return {
          text: 'System: Idle',
          pulse: 'bg-emerald-400',
        };
    }
  };

  const status = getSystemStatusMessage();
  const isAnyPlaying = activeAnimation !== 'none';

  return (
    <div
      className="w-full max-w-xl rounded-[32px] bg-white/70 border border-white/60 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300"
      id="playground-control-panel"
      role="main"
      aria-labelledby="main-title"
    >
      {/* Decorative clean ambient glows in background */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent" />
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest mb-3 border border-indigo-100/80 bg-indigo-50/50 text-indigo-600 shadow-sm">
          <Activity className="h-3 w-3 animate-pulse text-indigo-500" />
          <span>Lab Environment v1.0.4</span>
        </div>

        <h1
          id="main-title"
          className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 mb-3"
        >
          Animation Playground
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
          A professional interaction suite designed to test atmospheric particle effects, wind vectors, and fluid motion.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={onTriggerSnowflakes}
          disabled={isAnyPlaying}
          aria-label="Trigger Snowflake Animation"
          aria-pressed={activeAnimation === 'snowflakes'}
          className={`group relative overflow-hidden h-24 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center gap-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer ${
            activeAnimation === 'snowflakes'
              ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-md scale-[1.01]'
              : isAnyPlaying
              ? 'bg-slate-50/30 border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:shadow-md hover:scale-[1.01]'
          }`}
        >
          <span className={`text-2xl transition-transform duration-500 ${activeAnimation === 'snowflakes' ? 'animate-spin' : 'group-hover:scale-110'}`}>❄️</span>
          <span className="text-xs sm:text-sm font-semibold tracking-tight uppercase">Snow</span>
          {activeAnimation === 'snowflakes' && (
            <div className="absolute bottom-0 left-0 h-[3px] bg-sky-400 transition-all" style={{ width: `${(timeLeft / 5) * 100}%` }} />
          )}
        </button>

        <button
          onClick={onTriggerBalloons}
          disabled={isAnyPlaying}
          aria-label="Trigger Balloon Animation"
          aria-pressed={activeAnimation === 'balloons'}
          className={`group relative overflow-hidden h-24 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center gap-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer ${
            activeAnimation === 'balloons'
              ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-800 shadow-md scale-[1.01]'
              : isAnyPlaying
              ? 'bg-slate-50/30 border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:shadow-md hover:scale-[1.01]'
          }`}
        >
          <span className={`text-2xl transition-transform duration-500 ${activeAnimation === 'balloons' ? 'animate-bounce' : 'group-hover:scale-110'}`}>🎈</span>
          <span className="text-xs sm:text-sm font-semibold tracking-tight uppercase">Balloons</span>
          {activeAnimation === 'balloons' && (
            <div className="absolute bottom-0 left-0 h-[3px] bg-fuchsia-400 transition-all" style={{ width: `${(timeLeft / 5) * 100}%` }} />
          )}
        </button>

        <button
          onClick={onTriggerConfetti}
          disabled={isAnyPlaying}
          aria-label="Trigger Confetti Animation"
          aria-pressed={activeAnimation === 'confetti'}
          className={`group relative overflow-hidden h-24 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center gap-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer ${
            activeAnimation === 'confetti'
              ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-md scale-[1.01]'
              : isAnyPlaying
              ? 'bg-slate-50/30 border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:shadow-md hover:scale-[1.01]'
          }`}
        >
          <span className={`text-2xl transition-transform duration-500 ${activeAnimation === 'confetti' ? 'animate-pulse' : 'group-hover:scale-110'}`}>🎉</span>
          <span className="text-xs sm:text-sm font-semibold tracking-tight uppercase">Confetti</span>
          {activeAnimation === 'confetti' && (
            <div className="absolute bottom-0 left-0 h-[3px] bg-rose-400 transition-all" style={{ width: `${(timeLeft / 5) * 100}%` }} />
          )}
        </button>
      </div>

      {/* Telemetry & Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-slate-100 pt-8 mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Snowfalls</p>
          <p className="text-2xl font-mono font-medium text-sky-600">
            {String(stats.snowflakesTriggered).padStart(2, '0')}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Launches</p>
          <p className="text-2xl font-mono font-medium text-fuchsia-600">
            {String(stats.balloonsTriggered).padStart(2, '0')}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stars</p>
          <p className="text-2xl font-mono font-medium text-rose-600">
            {String(stats.confettiTriggered).padStart(2, '0')}
          </p>
        </div>
        <div className="space-y-1 col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Activity</p>
          <p className="text-base font-mono font-medium text-slate-800 truncate" title={stats.lastTriggeredAt?.toLocaleTimeString() || ''}>
            {stats.lastTriggeredAt ? formatTimestamp(stats.lastTriggeredAt) : 'None'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Runtime</p>
          <p className="text-xs font-semibold text-slate-600 mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Browser Engine
          </p>
        </div>
      </div>

      {/* Secondary Controls & Status Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-2">
        <div className="flex items-center gap-3 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-100 w-fit">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status:</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status.pulse} animate-pulse`} />
            <p className="text-xs font-semibold text-slate-600">{status.text}</p>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer"
          aria-label="Reset all animations"
        >
          Reset System
        </button>
      </div>
    </div>
  );
}
