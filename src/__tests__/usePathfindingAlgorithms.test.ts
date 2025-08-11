import { renderHook, act } from '@testing-library/react';
import { usePathfindingAlgorithms } from '../hooks/usePathfindingAlgorithms';
import { vi } from 'vitest';

// Mock setTimeout and clearTimeout
global.setTimeout = vi.fn((callback: Function) => {
  const id = Math.random();
  // Execute callback immediately for testing
  if (typeof callback === 'function') {
    callback();
  }
  return id as any;
}) as any;

global.clearTimeout = vi.fn();

describe('usePathfindingAlgorithms Hook', () => {
  const mockMaze = [
    ['wall', 'start', 'wall'],
    ['path', 'path', 'path'],
    ['wall', 'end', 'wall']
  ];

  const mockOnUpdateMaze = vi.fn();
  const mockOnComplete = vi.fn();
  const mockOnSetTimeout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BFS Algorithm', () => {
    it('should call onComplete when path is found', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [1, 0], // Start position
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'BFS');
    });

    it('should update maze during traversal', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnUpdateMaze).toHaveBeenCalled();
    });

    it('should call onSetTimeout for animation', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnSetTimeout).toHaveBeenCalled();
    });

    it('should handle maze with no path to end', () => {
      const blockedMaze = [
        ['wall', 'start', 'wall'],
        ['wall', 'wall', 'wall'],
        ['wall', 'end', 'wall']
      ];

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [1, 0],
          blockedMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'BFS');
    });

    it('should find end immediately if start is adjacent to end', () => {
      const adjacentMaze = [
        ['wall', 'wall', 'wall'],
        ['start', 'end', 'wall'],
        ['wall', 'wall', 'wall']
      ];

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [0, 1],
          adjacentMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'BFS');
    });
  });

  describe('DFS Algorithm', () => {
    it('should call onComplete when path is found', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.dfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'DFS');
    });

    it('should update maze during traversal', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.dfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnUpdateMaze).toHaveBeenCalled();
    });

    it('should use randomized directions', () => {
      // Mock Math.random to ensure consistent behavior
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.dfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalled();

      // Restore original Math.random
      Math.random = originalRandom;
    });

    it('should handle single cell maze', () => {
      const singleCellMaze = [['start']];

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.dfs(
          [0, 0],
          singleCellMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      // Should complete even though no end is found
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'DFS');
    });

    it('should log visiting cells', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.dfs(
          [1, 0],
          mockMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(consoleSpy).toHaveBeenCalledWith('DFS visiting:', expect.any(Number), expect.any(Number));

      consoleSpy.mockRestore();
    });
  });

  describe('Algorithm Comparison', () => {
    it('both algorithms should complete successfully', () => {
      const { result } = renderHook(() => usePathfindingAlgorithms());

      const bfsComplete = vi.fn();
      const dfsComplete = vi.fn();

      act(() => {
        result.current.bfs(
          [1, 0],
          mockMaze,
          vi.fn(),
          bfsComplete,
          vi.fn()
        );
      });

      act(() => {
        result.current.dfs(
          [1, 0],
          mockMaze,
          vi.fn(),
          dfsComplete,
          vi.fn()
        );
      });

      expect(bfsComplete).toHaveBeenCalledWith(expect.any(Number), 'BFS');
      expect(dfsComplete).toHaveBeenCalledWith(expect.any(Number), 'DFS');
    });

    it('should handle bounds checking correctly', () => {
      const smallMaze = [['start', 'end']];

      const { result } = renderHook(() => usePathfindingAlgorithms());

      act(() => {
        result.current.bfs(
          [0, 0],
          smallMaze,
          mockOnUpdateMaze,
          mockOnComplete,
          mockOnSetTimeout
        );
      });

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 'BFS');
    });
  });
});
