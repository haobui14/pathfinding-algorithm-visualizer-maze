import { useEffect, useState } from "react";

interface TimerProps {
  isRunning: boolean;
  currentAlgorithm: string;
  onTimerUpdate: (time: number) => void;
}

export function Timer({ isRunning, currentAlgorithm, onTimerUpdate }: TimerProps) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime + 10;
          onTimerUpdate(newTime);
          return newTime;
        });
      }, 10);
    } else {
      setTimer(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimerUpdate]);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  return (
    <div className="timer-container">
      <div className="current-timer">
        <strong>Current Timer: {formatTime(timer)}</strong>
        {isRunning && <span> (Running: {currentAlgorithm})</span>}
      </div>
    </div>
  );
}
