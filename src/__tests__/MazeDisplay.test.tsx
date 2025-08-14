import { render, screen } from "@testing-library/react";
import { MazeDisplay } from "../components/MazeDisplay";

const mockMaze = [
  ["wall", "start", "wall"],
  ["path", "path", "wall"],
  ["wall", "end", "wall"],
];

describe("MazeDisplay Component", () => {
  it("renders maze grid correctly", () => {
    render(<MazeDisplay maze={mockMaze} />);

    const mazeContainer = screen.getByTestId("maze-display");
    expect(mazeContainer).toHaveClass("maze");
  });

  it("renders correct number of rows", () => {
    render(<MazeDisplay maze={mockMaze} />);

    const rows = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("row"));
    expect(rows).toHaveLength(3);
  });

  it("renders correct number of cells", () => {
    render(<MazeDisplay maze={mockMaze} />);

    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("cell"));
    expect(cells).toHaveLength(9); // 3x3 grid
  });

  it("applies correct CSS classes to cells", () => {
    render(<MazeDisplay maze={mockMaze} />);

    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("cell"));

    // Check first row: wall, start, wall
    expect(cells[0]).toHaveClass("cell", "wall");
    expect(cells[1]).toHaveClass("cell", "start");
    expect(cells[2]).toHaveClass("cell", "wall");

    // Check second row: path, path, wall
    expect(cells[3]).toHaveClass("cell", "path");
    expect(cells[4]).toHaveClass("cell", "path");
    expect(cells[5]).toHaveClass("cell", "wall");

    // Check third row: wall, end, wall
    expect(cells[6]).toHaveClass("cell", "wall");
    expect(cells[7]).toHaveClass("cell", "end");
    expect(cells[8]).toHaveClass("cell", "wall");
  });

  it("handles empty maze gracefully", () => {
    render(<MazeDisplay maze={[]} />);

    const rows = screen
      .queryAllByRole("generic")
      .filter((el) => el.className.includes("row"));
    expect(rows).toHaveLength(0);
  });

  it("handles maze with visited cells", () => {
    const mazeWithVisited = [
      ["wall", "start", "wall"],
      ["visited", "visited", "wall"],
      ["wall", "end", "wall"],
    ];

    render(<MazeDisplay maze={mazeWithVisited} />);

    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("cell"));

    expect(cells[3]).toHaveClass("cell", "visited");
    expect(cells[4]).toHaveClass("cell", "visited");
  });

  it("renders single row maze correctly", () => {
    const singleRowMaze = [["start", "path", "end"]];

    render(<MazeDisplay maze={singleRowMaze} />);

    const rows = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("row"));
    expect(rows).toHaveLength(1);

    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("cell"));
    expect(cells).toHaveLength(3);
  });

  it("renders single column maze correctly", () => {
    const singleColumnMaze = [["start"], ["path"], ["end"]];

    render(<MazeDisplay maze={singleColumnMaze} />);

    const rows = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("row"));
    expect(rows).toHaveLength(3);

    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("cell"));
    expect(cells).toHaveLength(3);
  });
});
