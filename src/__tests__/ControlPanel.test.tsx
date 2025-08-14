import { render, screen, fireEvent } from "@testing-library/react";
import { ControlPanel } from "../components/ControlPanel";
import { vi } from "vitest";

describe("ControlPanel Component", () => {
  const defaultProps = {
    onGenerateMaze: vi.fn(),
    onStartBFS: vi.fn(),
    onStartDFS: vi.fn(),
    showRecordsTable: false,
    onToggleRecords: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all control buttons", () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByText("Refresh Maze")).toBeInTheDocument();
    expect(screen.getByText("Start BFS")).toBeInTheDocument();
    expect(screen.getByText("Start DFS")).toBeInTheDocument();
    expect(screen.getByText("Show Records")).toBeInTheDocument();
  });

  it("calls onGenerateMaze when refresh button is clicked", () => {
    render(<ControlPanel {...defaultProps} />);

    const refreshButton = screen.getByText("Refresh Maze");
    fireEvent.click(refreshButton);

    expect(defaultProps.onGenerateMaze).toHaveBeenCalledTimes(1);
  });

  it("calls onStartBFS when BFS button is clicked", () => {
    render(<ControlPanel {...defaultProps} />);

    const bfsButton = screen.getByText("Start BFS");
    fireEvent.click(bfsButton);

    expect(defaultProps.onStartBFS).toHaveBeenCalledTimes(1);
  });

  it("calls onStartDFS when DFS button is clicked", () => {
    render(<ControlPanel {...defaultProps} />);

    const dfsButton = screen.getByText("Start DFS");
    fireEvent.click(dfsButton);

    expect(defaultProps.onStartDFS).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleRecords when toggle button is clicked", () => {
    render(<ControlPanel {...defaultProps} />);

    const toggleButton = screen.getByText("Show Records");
    fireEvent.click(toggleButton);

    expect(defaultProps.onToggleRecords).toHaveBeenCalledTimes(1);
  });

  it('shows "Show Records" text when table is hidden', () => {
    render(<ControlPanel {...defaultProps} showRecordsTable={false} />);

    expect(screen.getByText("Show Records")).toBeInTheDocument();
  });

  it('shows "Hide Records" text when table is visible', () => {
    render(<ControlPanel {...defaultProps} showRecordsTable={true} />);

    expect(screen.getByText("Hide Records")).toBeInTheDocument();
  });

  it("applies correct styling to toggle button based on state", () => {
    const { rerender } = render(
      <ControlPanel {...defaultProps} showRecordsTable={false} />
    );

    let toggleButton = screen.getByText("Show Records");
    expect(toggleButton).toHaveStyle({ backgroundColor: "#6c757d" });

    rerender(<ControlPanel {...defaultProps} showRecordsTable={true} />);

    toggleButton = screen.getByText("Hide Records");
    expect(toggleButton).toHaveStyle({ backgroundColor: "#dc3545" });
  });
});
