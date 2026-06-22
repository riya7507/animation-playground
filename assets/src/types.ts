/**
 * Types and interfaces for the Animation Playground application.
 */

export type AnimationType = 'none' | 'snowflakes' | 'balloons' | 'confetti';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'start' | 'info' | 'end' | 'reset' | 'confetti';
  timestamp: Date;
}

export interface AnimationStats {
  snowflakesTriggered: number;
  balloonsTriggered: number;
  confettiTriggered: number;
  lastTriggeredAt: Date | null;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'snow' | 'balloon' | 'confetti' | 'reset' | 'system';
}
