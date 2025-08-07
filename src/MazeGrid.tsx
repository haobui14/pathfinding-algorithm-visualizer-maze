import { useEffect, useState } from 'react';
import './App.css';
import { bfs, dfs } from './algorithms';

function MazeGrid({ width = 15, height = 15 }) {
  const [maze, setMaze] = useState<string[][]>([]);

  useEffect(() => {
    generateMaze();
  }, []);

  const handleBfs = () => {
    console.log(bfs(maze, [1, 0]));
  };

  const handleDfs = () => {
    console.log(dfs(maze, [1, 0]));
  };

  const generateMaze = () => {
    const matrix: string[][] = [];

    for (let i = 0; i < height; i++) {
      const row: string[] = [];
      for (let j = 0; j < width; j++) {
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

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = 'path';
          carvePath(nx, ny);
        }
      }
    };

    carvePath(1, 1);

    matrix[1][0] = 'start';
    matrix[height - 2][width - 1] = 'end';

    setMaze(matrix);
  };

  return (
    <div className='maze-grid'>
      <div className='button-container'>
        <button className='maze-button' onClick={generateMaze}>
          Refresh Maze
        </button>
        <button className='maze-button' onClick={handleBfs}>
          Start BFS
        </button>
        <button className='maze-button' onClick={handleDfs}>
          Start DFS
        </button>
      </div>
      <div className='maze'>
        {maze.map((row, rowIndex) => (
          <div className='row' key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <div className={`cell ${cell}`} key={`cell-${cellIndex}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MazeGrid;

