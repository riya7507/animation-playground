import React, { useRef, useEffect } from 'react';
import { Terminal, Snowflake, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { LogEntry } from '../types';

interface EventLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export default function EventLog({ logs, onClearLogs }: EventLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'snow':
        return <Snowflake className="h-3 w-3 text-sky-500 animate-spin-slow" />;
      case 'balloon':
        return <Sparkles className="h-3 w-3 text-fuchsia-500" />;
      case 'confetti':
        return <Sparkles className="h-3 w-3 text-rose-500 animate-pulse" />;
      case 'reset':
        return <RefreshCw className="h-3 w-3 text-slate-500" />;
      default:
        return <Terminal className="h-3 w-3 text-indigo-500" />;
    }
  };

  const formatLogTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
  };

  return (
    <div
      className="w-full max-w-xl rounded-2xl bg-white/50 border border-white/50 backdrop-blur-xl p-5 shadow-lg relative overflow-hidden"
      role="region"
      aria-label="Activity event logs"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-500" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-700">System Activity Logs</h3>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-700 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
            aria-label="Clear all event logs"
          >
            Clear Console
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="h-32 overflow-y-auto font-mono text-[11px] text-slate-600 space-y-1.5 pr-2 custom-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 gap-1.5 select-none">
            <AlertCircle className="h-3.5 w-3.5 text-slate-300" />
            <span>Console idle. Trigger actions to stream activity data.</span>
          </div>
        ) : (
          logs.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-2.5 py-0.5 hover:bg-slate-100/50 px-1 rounded transition-colors"
            >
              <span className="text-slate-400 flex-shrink-0 font-medium">
                [{formatLogTime(entry.timestamp)}]
              </span>
              <span className="mt-0.5 flex-shrink-0">{getLogIcon(entry.type)}</span>
              <span className="flex-1 break-words leading-relaxed text-slate-600">{entry.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Embedded CSS for custom scrollbar sizing in light theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}
