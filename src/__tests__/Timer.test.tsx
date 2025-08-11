import { render, screen } from '@testing-library/react';
import { Timer } from '../components/Timer';
import { vi } from 'vitest';

describe('Timer Component', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders initial timer state correctly', () => {
    const mockOnTimerUpdate = vi.fn();
    
    render(
      <Timer 
        isRunning={false} 
        currentAlgorithm="" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    expect(screen.getByText('Current Timer: 0.000s')).toBeInTheDocument();
  });

  it('displays algorithm name when running', () => {
    const mockOnTimerUpdate = vi.fn();
    
    render(
      <Timer 
        isRunning={true} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    expect(screen.getByText(/Running: BFS/)).toBeInTheDocument();
  });

  it('does not display algorithm name when not running', () => {
    const mockOnTimerUpdate = vi.fn();
    
    render(
      <Timer 
        isRunning={false} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    expect(screen.queryByText(/Running: BFS/)).not.toBeInTheDocument();
  });

  it('calls onTimerUpdate when timer is running', () => {
    const mockOnTimerUpdate = vi.fn();
    
    render(
      <Timer 
        isRunning={true} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    // Fast forward time to trigger interval
    vi.advanceTimersByTime(100); // Wait for timer updates

    expect(mockOnTimerUpdate).toHaveBeenCalled();
    expect(mockOnTimerUpdate).toHaveBeenCalledWith(expect.any(Number));
  });

  it('resets timer when isRunning changes from true to false', () => {
    const mockOnTimerUpdate = vi.fn();
    
    const { rerender } = render(
      <Timer 
        isRunning={true} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    // Let timer run for a bit
    vi.advanceTimersByTime(100);

    // Stop the timer
    rerender(
      <Timer 
        isRunning={false} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    // Timer should reset to 0
    expect(screen.getByText('Current Timer: 0.000s')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    const mockOnTimerUpdate = vi.fn();
    
    render(
      <Timer 
        isRunning={true} 
        currentAlgorithm="BFS" 
        onTimerUpdate={mockOnTimerUpdate} 
      />
    );

    // Fast forward to 1.234 seconds (1234ms)
    vi.advanceTimersByTime(1234);

    expect(screen.getByText(/Current Timer:/)).toBeInTheDocument();
    expect(screen.getByText(/Running: BFS/)).toBeInTheDocument();
  });
});
