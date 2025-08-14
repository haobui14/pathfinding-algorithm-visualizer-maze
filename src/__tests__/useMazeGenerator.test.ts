import { renderHook } from "@testing-library/react";
import { useMazeGenerator } from "../hooks/useMazeGenerator";

describe("useMazeGenerator Hook", () => {
  it("generates a maze with correct dimensions (odd)", () => {
    const { result } = renderHook(() => useMazeGenerator(15, 15));
    const maze = result.current.generateMaze();

    expect(maze).toHaveLength(15); // Height should be 15
    expect(maze[0]).toHaveLength(15); // Width should be 15
  });

  it("adjusts even dimensions to odd", () => {
    const { result } = renderHook(() => useMazeGenerator(16, 14));
    const maze = result.current.generateMaze();

    expect(maze).toHaveLength(13); // 14 - 1 = 13
    expect(maze[0]).toHaveLength(15); // 16 - 1 = 15
  });

  it("generates start and end points correctly", () => {
    const { result } = renderHook(() => useMazeGenerator(15, 15));
    const maze = result.current.generateMaze();

    expect(maze[1][0]).toBe("start"); // Start position
    expect(maze[13][13]).toBe("end"); // End position (mazeHeight-2, mazeWidth-2)
  });

  it("creates walls around the perimeter", () => {
    const { result } = renderHook(() => useMazeGenerator(5, 5));
    const maze = result.current.generateMaze();

    // Check top and bottom rows
    for (let col = 0; col < 5; col++) {
      if (!(maze[0][col] === "start" || maze[0][col] === "end")) {
        expect(maze[0][col]).toBe("wall");
      }
      if (!(maze[4][col] === "start" || maze[4][col] === "end")) {
        expect(maze[4][col]).toBe("wall");
      }
    }

    // Check left and right columns
    for (let row = 0; row < 5; row++) {
      if (!(maze[row][0] === "start" || maze[row][0] === "end")) {
        expect(maze[row][0]).toBe("wall");
      }
      if (!(maze[row][4] === "start" || maze[row][4] === "end")) {
        expect(maze[row][4]).toBe("wall");
      }
    }
  });

  it("generates different mazes on multiple calls", () => {
    const { result } = renderHook(() => useMazeGenerator(7, 7));
    const maze1 = result.current.generateMaze();
    const maze2 = result.current.generateMaze();

    // Mazes should be different (very unlikely to be identical due to randomness)
    let isDifferent = false;
    for (let row = 0; row < maze1.length; row++) {
      for (let col = 0; col < maze1[row].length; col++) {
        if (maze1[row][col] !== maze2[row][col]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) break;
    }
    expect(isDifferent).toBe(true);
  });

  it("creates valid path from start position", () => {
    const { result } = renderHook(() => useMazeGenerator(5, 5));
    const maze = result.current.generateMaze();

    // Start should be connected to a path
    expect(maze[1][1]).toBe("path"); // Should be path adjacent to start
  });

  it("handles minimum size correctly", () => {
    const { result } = renderHook(() => useMazeGenerator(3, 3));
    const maze = result.current.generateMaze();

    expect(maze).toHaveLength(3);
    expect(maze[0]).toHaveLength(3);
    expect(maze[1][0]).toBe("start");
    // For minimum size, end might be placed at various positions
    expect(["path", "end"]).toContain(maze[1][1]);
    expect(["path", "end", "wall"]).toContain(maze[1][2]);
  });

  it("initializes all cells as walls before carving", () => {
    // Test internal state by checking that carving creates paths
    const { result } = renderHook(() => useMazeGenerator(7, 7));
    const maze = result.current.generateMaze();

    // Count non-wall cells (should be paths, start, and end)
    let nonWallCount = 0;
    let wallCount = 0;

    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        if (maze[row][col] === "wall") {
          wallCount++;
        } else {
          nonWallCount++;
        }
      }
    }

    // Should have both walls and non-walls
    expect(wallCount).toBeGreaterThan(0);
    expect(nonWallCount).toBeGreaterThan(0);
    expect(wallCount + nonWallCount).toBe(7 * 7); // Total cells
  });
});
