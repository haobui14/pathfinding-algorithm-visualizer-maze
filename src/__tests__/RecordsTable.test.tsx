import { render, screen, fireEvent } from "@testing-library/react";
import { RecordsTable } from "../components/RecordsTable";
import { vi } from "vitest";

const mockSessionResults = [
  { algorithm: "BFS", time: 1234, timestamp: "10:30:15 AM" },
  { algorithm: "DFS", time: 2345, timestamp: "10:31:20 AM" },
  { algorithm: "BFS", time: 987, timestamp: "10:32:10 AM" },
];

describe("RecordsTable Component", () => {
  const defaultProps = {
    isVisible: true,
    sessionResults: mockSessionResults,
    onClose: vi.fn(),
    onClearResults: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not visible", () => {
    render(<RecordsTable {...defaultProps} isVisible={false} />);

    expect(screen.queryByText("Session Records")).not.toBeInTheDocument();
  });

  it("renders session records table when visible", () => {
    render(<RecordsTable {...defaultProps} />);

    expect(screen.getByText("Session Records")).toBeInTheDocument();
    expect(screen.getByText("Algorithm")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Timestamp")).toBeInTheDocument();
  });

  it("displays all session results", () => {
    render(<RecordsTable {...defaultProps} />);

    expect(screen.getAllByText("BFS")).toHaveLength(2);
    expect(screen.getByText("DFS")).toBeInTheDocument();
    expect(screen.getByText("1.234s")).toBeInTheDocument();
    expect(screen.getByText("2.345s")).toBeInTheDocument();
    expect(screen.getByText("0.987s")).toBeInTheDocument();
    expect(screen.getByText("10:30:15 AM")).toBeInTheDocument();
    expect(screen.getByText("10:31:20 AM")).toBeInTheDocument();
    expect(screen.getByText("10:32:10 AM")).toBeInTheDocument();
  });

  it("shows total runs count", () => {
    render(<RecordsTable {...defaultProps} />);

    expect(screen.getByText("Total Runs: 3")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<RecordsTable {...defaultProps} />);

    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClearResults when clear button is clicked", () => {
    render(<RecordsTable {...defaultProps} />);

    const clearButton = screen.getByText("Clear All");
    fireEvent.click(clearButton);

    expect(defaultProps.onClearResults).toHaveBeenCalledTimes(1);
  });

  it("shows empty state message when no results", () => {
    render(<RecordsTable {...defaultProps} sessionResults={[]} />);

    expect(
      screen.getByText("No records yet. Run some algorithms!")
    ).toBeInTheDocument();
    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });

  it("applies correct styling to BFS and DFS algorithms", () => {
    render(<RecordsTable {...defaultProps} />);

    const bfsElements = screen.getAllByText("BFS");
    const dfsElements = screen.getAllByText("DFS");

    // BFS should be blue (#007bff)
    bfsElements.forEach((element) => {
      expect(element).toHaveStyle({ color: "#007bff" });
    });

    // DFS should be green (#28a745)
    dfsElements.forEach((element) => {
      expect(element).toHaveStyle({ color: "#28a745" });
    });
  });

  it("formats time correctly", () => {
    const customResults = [
      { algorithm: "BFS", time: 5000, timestamp: "10:30:15 AM" }, // 5 seconds
      { algorithm: "DFS", time: 1500, timestamp: "10:31:20 AM" }, // 1.5 seconds
    ];

    render(<RecordsTable {...defaultProps} sessionResults={customResults} />);

    expect(screen.getByText("5.000s")).toBeInTheDocument();
    expect(screen.getByText("1.500s")).toBeInTheDocument();
  });
});
