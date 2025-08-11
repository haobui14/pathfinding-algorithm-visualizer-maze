export function useMazeGenerator(width: number, height: number) {
  const generateMaze = (): string[][] => {
    // Adjust dimensions so the maze has odd width and height
    const mazeWidth = width % 2 === 0 ? width - 1 : width;
    const mazeHeight = height % 2 === 0 ? height - 1 : height;

    // Create the initial matrix filled with 'wall'
    const matrix: string[][] = [];
    for (let i = 0; i < mazeHeight; i++) {
      const row = [] as string[];
      for (let j = 0; j < mazeWidth; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const isCellValid = (x: number, y: number) => {
      return (
        y >= 0 &&
        x >= 0 &&
        x < mazeWidth &&
        y < mazeHeight &&
        matrix[y][x] === "wall"
      );
    };

    const carvePath = (x: number, y: number) => {
      matrix[y][x] = "path";

      const directions = [...dirs].sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }
      }
    };

    // Start carving the maze from the (1, 1) position
    carvePath(1, 1);

    // Set start and end points
    matrix[1][0] = "start"; // Start on the left wall
    matrix[mazeHeight - 2][mazeWidth - 2] = "end"; // End inside the maze (original position)

    return matrix;
  };

  return { generateMaze };
}
