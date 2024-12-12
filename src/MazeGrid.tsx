import { useEffect, useState } from 'react';
import './App.css';

function MazeGrid({ width = 15, height = 15 }) {
  const [maze, setMaze] = useState<string[][]>([]);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);

  useEffect(() => {
    generateMaze();
  }, []);

  const bfs = (startNode: number[]) => {
    const queue = [startNode];
    const visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    const visitCell = ([x, y]: [number, number]) => {
      console.log(x, y);

      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === 'end' ? 'end' : 'visited';
            }
            return cell;
          })
        )
      );

      if (maze[y][x] === 'end') {
        console.log('path found!');
        return true;
      }
      return false;
    };

    const step = () => {
      if (queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift()!;

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx}, ${ny}`)
        ) {
          visited.add(`${nx}, ${ny}`);
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end') {
            if (visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    };
    step();
    return false;
  };

  const dfs = (startNode: number[]) => {
    const stack = [startNode];
    const visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    const visitCell = ([x, y]: [number, number]) => {
      console.log(x, y);

      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === 'end' ? 'end' : 'visited';
            }
            return cell;
          })
        )
      );

      if (maze[y][x] === 'end') {
        console.log('path found!');
        return true;
      }
      return false;
    };

    const step = () => {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop()!;
      console.log('new step');

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx}, ${ny}`)
        ) {
          visited.add(`${nx}, ${ny}`);
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end') {
            if (maze[ny][nx] === 'path') {
              maze[ny][nx] = 'visited';
              console.log(maze[ny][nx]);
            }
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    };
    step();
    return false;
  };

  const generateMaze = () => {
    //clear any timeout from the queue before refresh the Maze to avoid the ongoing loop of timeout
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);

    // Adjust dimensions to include extra space for the bottom and right walls
    const matrix: string[][] = [];

    // Create the initial matrix filled with 'wall'
    for (let i = 0; i < height; i++) {
      const row = [];
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

    // Start carving the maze from the (1, 1) position
    carvePath(1, 1);

    // Set start and end points
    matrix[1][0] = 'start';
    matrix[height - 2][width - 1] = 'end';

    // Set the maze state (assuming you are using setMaze as a state setter)
    setMaze(matrix);
  };

  return (
    <div className='maze-grid'>
      <div className='button-container'>
        <button className='maze-button' onClick={() => generateMaze()}>
          Refresh Maze
        </button>
        <button className='maze-button' onClick={() => bfs([1, 0])}>
          Start BFS
        </button>
        <button className='maze-button' onClick={() => dfs([1, 0])}>
          Start DFS
        </button>
      </div>
      <div className='maze'>
        {maze.map((row, rowIndex) => (
          <div className='row' key={`row-${rowIndex}`}>
            {row.map((cell, rcellIndex) => (
              <div className={`cell ${cell}`} key={`cell-${rcellIndex}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MazeGrid;
