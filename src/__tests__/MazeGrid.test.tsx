import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MazeGrid from "../MazeGrid";

// Mock the hooks
vi.mock("../hooks/useMazeGenerator", () => ({
  useMazeGenerator: () => ({
    generateMaze: vi.fn(() => [
      ["wall", "start", "wall"],
      ["path", "path", "path"],
      ["wall", "end", "wall"],
    ]),
  }),
}));

vi.mock("../hooks/usePathfindingAlgorithms", () => ({
  usePathfindingAlgorithms: () => ({
    bfs: vi.fn((startNode, maze, onUpdateMaze, onComplete) => {
      // Simulate algorithm completion immediately for testing
      onComplete(1000, "BFS");
    }),
    dfs: vi.fn((startNode, maze, onUpdateMaze, onComplete) => {
      onComplete(1500, "DFS");
    }),
  }),
}));

describe("MazeGrid Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all main components", () => {
    render(<MazeGrid width={15} height={15} />);

    expect(screen.getByText("Refresh Maze")).toBeInTheDocument();
    expect(screen.getByText("Start BFS")).toBeInTheDocument();
    expect(screen.getByText("Start DFS")).toBeInTheDocument();
    expect(screen.getByText("Show Records")).toBeInTheDocument();
    expect(screen.getByText(/Current Timer:/)).toBeInTheDocument();
  });

  it("generates maze on initial load", () => {
    render(<MazeGrid width={15} height={15} />);

    // Should render the maze grid
    const mazeContainer = screen.getByTestId("maze-display");
    expect(mazeContainer).toBeInTheDocument();
  });

  it("starts BFS algorithm when button is clicked", async () => {
    render(<MazeGrid width={15} height={15} />);

    const bfsButton = screen.getByText("Start BFS");
    fireEvent.click(bfsButton);

    // Algorithm completes immediately in mock
    await waitFor(() => {
      expect(screen.getByText(/Current Timer:/)).toBeInTheDocument();
    });
  });

  it("starts DFS algorithm when button is clicked", async () => {
    render(<MazeGrid width={15} height={15} />);

    const dfsButton = screen.getByText("Start DFS");
    fireEvent.click(dfsButton);

    // Algorithm completes immediately in mock
    await waitFor(() => {
      expect(screen.getByText(/Current Timer:/)).toBeInTheDocument();
    });
  });

  it("shows and hides records table", () => {
    render(<MazeGrid width={15} height={15} />);

    // Initially hidden
    expect(screen.queryByText("Session Records")).not.toBeInTheDocument();

    // Show records
    const toggleButton = screen.getByText("Show Records");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Session Records")).toBeInTheDocument();
    expect(screen.getByText("Hide Records")).toBeInTheDocument();

    // Hide records
    const hideButton = screen.getByText("Hide Records");
    fireEvent.click(hideButton);

    expect(screen.queryByText("Session Records")).not.toBeInTheDocument();
    expect(screen.getByText("Show Records")).toBeInTheDocument();
  });

  it("records algorithm results", async () => {
    render(<MazeGrid width={15} height={15} />);

    // Show records table first
    fireEvent.click(screen.getByText("Show Records"));

    // Run BFS
    fireEvent.click(screen.getByText("Start BFS"));

    await waitFor(() => {
      expect(screen.getByText("BFS")).toBeInTheDocument();
    });

    // Run DFS
    fireEvent.click(screen.getByText("Start DFS"));

    await waitFor(() => {
      expect(screen.getAllByText("BFS")).toHaveLength(1);
      expect(screen.getByText("DFS")).toBeInTheDocument();
      expect(screen.getByText("Total Runs: 2")).toBeInTheDocument();
    });
  });

  it("clears results when clear button is clicked", async () => {
    render(<MazeGrid width={15} height={15} />);

    // Show records and run an algorithm
    fireEvent.click(screen.getByText("Show Records"));
    fireEvent.click(screen.getByText("Start BFS"));

    await waitFor(() => {
      expect(screen.getByText("Total Runs: 1")).toBeInTheDocument();
    });

    // Clear results
    fireEvent.click(screen.getByText("Clear All"));

    expect(
      screen.getByText("No records yet. Run some algorithms!")
    ).toBeInTheDocument();
  });

  it("refreshes maze when refresh button is clicked", () => {
    render(<MazeGrid width={15} height={15} />);

    const refreshButton = screen.getByText("Refresh Maze");
    fireEvent.click(refreshButton);

    // Should still have maze displayed
    const mazeContainer = screen.getByTestId("maze-display");
    expect(mazeContainer).toBeInTheDocument();
  });

  it("handles multiple algorithm runs", async () => {
    render(<MazeGrid width={15} height={15} />);

    fireEvent.click(screen.getByText("Show Records"));

    // Run multiple algorithms
    fireEvent.click(screen.getByText("Start BFS"));
    fireEvent.click(screen.getByText("Start DFS"));
    fireEvent.click(screen.getByText("Start BFS"));

    await waitFor(() => {
      expect(screen.getByText("Total Runs: 3")).toBeInTheDocument();
    });
  });

  it("displays timer correctly during algorithm execution", async () => {
    render(<MazeGrid width={15} height={15} />);

    fireEvent.click(screen.getByText("Start BFS"));

    // Timer should be visible
    await waitFor(() => {
      expect(screen.getByText("Current Timer: 0.000s")).toBeInTheDocument();
    });
  });

  it("closes records table with X button", () => {
    render(<MazeGrid width={15} height={15} />);

    // Show records table
    fireEvent.click(screen.getByText("Show Records"));
    expect(screen.getByText("Session Records")).toBeInTheDocument();

    // Close with X button
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("Session Records")).not.toBeInTheDocument();
  });
});
