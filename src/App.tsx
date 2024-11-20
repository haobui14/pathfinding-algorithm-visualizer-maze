import { useState } from 'react';
import './App.css';

function App() {
  const initialMaze = [
    ['wall', 'wall', 'wall', 'wall'],
    ['start', 'path', 'path', 'wall'],
    ['wall', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'path', 'end'],
    ['wall', 'wall', 'wall', 'wall'],
  ];

  const [maze, setMaze] = useState<string[][]>(initialMaze);

const generateMaze = (height: number, width: number) => {
  // Adjust dimensions to include extra space for the bottom and right walls
  const adjustedHeight = height + 1;
  const adjustedWidth = width + 1;
  const matrix: string[][] = [];

  // Create the initial matrix filled with 'wall'
  for (let i = 0; i < adjustedHeight; i++) {
    const row = [];
    for (let j = 0; j < adjustedWidth; j++) {
      row.push('wall');
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
      y >= 0 && x >= 0 && x < width && y < height && matrix[y][x] === 'wall'
    );
  };

  const carvePath = (x: number, y: number) => {
    matrix[y][x] = 'path';

    const directions = dirs.sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (isCellValid(nx, ny)) {
        matrix[y + dy][x + dx] = 'path';
        carvePath(nx, ny);
      }
    }
  };

  // Start carving the maze from the (1, 1) position
  carvePath(1, 1);

  // Set start and end points
  matrix[1][0] = 'start';
  matrix[height - 2][width - 1] = 'end';

  // Add walls to the bottom and right side
  for (let i = 0; i < adjustedHeight; i++) {
    matrix[i][width] = 'wall'; // Right side wall
  }
  for (let j = 0; j < adjustedWidth; j++) {
    matrix[height][j] = 'wall'; // Bottom side wall
  }

  // Set the maze state (assuming you are using setMaze as a state setter)
  setMaze(matrix);
};


  return (
    <div className='maze-grid'>
      <button className='maze-button' onClick={() => generateMaze(10, 10)}>
        Refresh Maze
      </button>
      <div className='maze'>
        {maze.map((row, rowIndex) => (
          <div className='row'>
            {row.map((cell, cellIndex) => (
              <div className={`cell ${cell}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
