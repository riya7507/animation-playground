import React, { useState, useEffect, useCallback } from 'react';
import AnimationCanvas from './components/AnimationCanvas';
import ControlCard from './components/ControlCard';
import EventLog from './components/EventLog';
import ToastContainer from './components/ToastContainer';
import { AnimationType, ToastMessage, AnimationStats, LogEntry } from './types';

export default function App() {
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>('none');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<AnimationStats>({
    snowflakesTriggered: 0,
    balloonsTriggered: 0,
    confettiTriggered: 0,
    lastTriggeredAt: null,
  });

  // Helper to add toast notifications
  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Helper to append log messages to the console
  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setLogs((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Dismiss toast
  const handleCloseToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Log clearing
  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Trigger Snowflakes cascade
  const handleTriggerSnowflakes = useCallback(() => {
    if (activeAnimation !== 'none') return;

    const now = new Date();
    setActiveAnimation('snowflakes');
    setTimeLeft(5.0);
    setStats((prev) => ({
      ...prev,
      snowflakesTriggered: prev.snowflakesTriggered + 1,
      lastTriggeredAt: now,
    }));

    addToast('50 medium-sized icy crystals generated. Enjoy the gentle drifting!', 'start');
    addLog('Snowfall cascade initiated. 50 vector crystals rendered on top frame vectors.', 'snow');
  }, [activeAnimation, addToast, addLog]);

  // Trigger Balloons launch
  const handleTriggerBalloons = useCallback(() => {
    if (activeAnimation !== 'none') return;

    const now = new Date();
    setActiveAnimation('balloons');
    setTimeLeft(5.0);
    setStats((prev) => ({
      ...prev,
      balloonsTriggered: prev.balloonsTriggered + 1,
      lastTriggeredAt: now,
    }));

    addToast('30 helium-filled glossy balloons launched with wind sway!', 'info');
    addLog('Buoyancy flight launched. 30 responsive balloons on side sway rendering.', 'balloon');
  }, [activeAnimation, addToast, addLog]);

  // Trigger Confetti cascade
  const handleTriggerConfetti = useCallback(() => {
    if (activeAnimation !== 'none') return;

    const now = new Date();
    setActiveAnimation('confetti');
    setTimeLeft(5.0);
    setStats((prev) => ({
      ...prev,
      confettiTriggered: prev.confettiTriggered + 1,
      lastTriggeredAt: now,
    }));

    addToast('60 colorful festive paper shapes scattered with spin angles!', 'confetti');
    addLog('Festive celebration initialized. 60 spinning confetti pieces rendering.', 'confetti');
  }, [activeAnimation, addToast, addLog]);

  // Complete current animation loop
  const handleAnimationEnd = useCallback(() => {
    const animType = activeAnimation;
    setActiveAnimation('none');
    setTimeLeft(0);

    let message = '';
    if (animType === 'snowflakes') {
      message = 'The winter snowfall sequence has completed gracefully.';
    } else if (animType === 'balloons') {
      message = 'The balloon flight sequence completed. Air pressures neutralized.';
    } else if (animType === 'confetti') {
      message = 'The celebration shower concluded. Confetti swept.';
    }
    
    addToast(message, 'end');
    addLog(
      animType === 'snowflakes'
        ? 'Snowflakes sequence terminated naturally. Restored canvas equilibrium.'
        : animType === 'balloons'
        ? 'Balloons drifted beyond standard altitude boundaries. Flight sequence complete.'
        : 'Confetti shower settled. Restored system equilibrium.',
      'system'
    );
  }, [activeAnimation, addToast, addLog]);

  // Reset all animations instantly
  const handleReset = useCallback(() => {
    if (activeAnimation === 'none' && logs.length === 0) {
      addToast('Playground cleared. Canvas is already idle and pristine.', 'reset');
      return;
    }

    setActiveAnimation('none');
    setTimeLeft(0);
    addToast('Canvas force fields flushed. All ongoing simulations aborted.', 'reset');
    addLog('Manual reset triggered. Erased active forces and cleared particles.', 'reset');
  }, [activeAnimation, logs.length, addToast, addLog]);

  // Chronometer count down mechanism for the 5.0 seconds simulation
  useEffect(() => {
    if (activeAnimation === 'none') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          handleAnimationEnd();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeAnimation, handleAnimationEnd]);

  // Seed initial welcoming logs upon initialization
  useEffect(() => {
    addLog('Animation Controller online. Core variables initialized.', 'system');
  }, [addLog]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing events if the user is currently focused on native inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 's') {
        e.preventDefault();
        handleTriggerSnowflakes();
      } else if (key === 'b') {
        e.preventDefault();
        handleTriggerBalloons();
      } else if (key === 'c') {
        e.preventDefault();
        handleTriggerConfetti();
      } else if (key === 'r') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAnimation, handleTriggerSnowflakes, handleTriggerBalloons, handleTriggerConfetti, handleReset]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-indigo-500/20 selection:text-slate-900">
      
      {/* Decorative Blur Ambient Elements in absolute margins to complement Clean Minimalism theme */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* 2D HTML5 Responsive Dynamic Canvas in standard background layer */}
      <AnimationCanvas
        activeAnimation={activeAnimation}
        onAnimationEnd={handleAnimationEnd}
        isAnimationActive={activeAnimation !== 'none'}
      />

      {/* Main control structure */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6 animate-fade-in my-auto">
        <ControlCard
          activeAnimation={activeAnimation}
          stats={stats}
          timeLeft={timeLeft}
          onTriggerSnowflakes={handleTriggerSnowflakes}
          onTriggerBalloons={handleTriggerBalloons}
          onTriggerConfetti={handleTriggerConfetti}
          onReset={handleReset}
        />

        <EventLog logs={logs} onClearLogs={handleClearLogs} />

        {/* Designed Footer / Keyboard Legend */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-400 mt-2 px-3 select-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">© 2026 Motion Dynamics Engine v1.0.4</p>
          <div className="flex gap-4">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-700 font-sans font-bold">S</kbd> Snow
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-700 font-sans font-bold">B</kbd> Balloons
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-700 font-sans font-bold">C</kbd> Confetti
            </span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-700 font-sans font-bold">R</kbd> Reset
            </span>
          </div>
        </div>
      </div>

      {/* Floated toast notification portal */}
      <ToastContainer toasts={toasts} onCloseToast={handleCloseToast} />

      {/* Inject custom simple animation CSS tricks */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
