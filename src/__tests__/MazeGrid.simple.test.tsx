import { render, screen, fireEvent } from "@testing-library/react";
import MazeGrid from "../MazeGrid";

// Simple integration test that focuses on basic functionality
describe("MazeGrid Simple Integration", () => {
  it("renders all main components and basic interactions work", () => {
    render(<MazeGrid width={15} height={15} />);

    // Check all main buttons are present
    expect(screen.getByText("Refresh Maze")).toBeInTheDocument();
    expect(screen.getByText("Start BFS")).toBeInTheDocument();
    expect(screen.getByText("Start DFS")).toBeInTheDocument();
    expect(screen.getByText("Show Records")).toBeInTheDocument();

    // Check timer is present
    expect(screen.getByText(/Current Timer:/)).toBeInTheDocument();

    // Check maze display is present
    expect(screen.getByTestId("maze-display")).toBeInTheDocument();

    // Test records toggle
    fireEvent.click(screen.getByText("Show Records"));
    expect(screen.getByText("Session Records")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Records"));
    expect(screen.queryByText("Session Records")).not.toBeInTheDocument();

    // Test maze refresh
    fireEvent.click(screen.getByText("Refresh Maze"));
    expect(screen.getByTestId("maze-display")).toBeInTheDocument();
  });
});
