interface PathfindingAlgorithm {
  bfs: (
    startNode: number[],
    maze: string[][],
    onUpdateMaze: (maze: string[][]) => void,
    onComplete: (time: number, algorithm: string) => void,
    onSetTimeout: (id: number) => void
  ) => void;
  dfs: (
    startNode: number[],
    maze: string[][],
    onUpdateMaze: (maze: string[][]) => void,
    onComplete: (time: number, algorithm: string) => void,
    onSetTimeout: (id: number) => void
  ) => void;
}

export function usePathfindingAlgorithms(): PathfindingAlgorithm {
  const bfs = (
    startNode: number[],
    maze: string[][],
    onUpdateMaze: (maze: string[][]) => void,
    onComplete: (time: number, algorithm: string) => void,
    onSetTimeout: (id: number) => void
  ) => {
    const startTime = Date.now();
    const gridHeight = maze.length;
    const gridWidth = gridHeight > 0 ? maze[0].length : 0;
    const queue = [startNode];
    const visited = new Set([`${startNode[0]}, ${startNode[1]}`]);
    let currentMaze = [...maze.map((row) => [...row])];
    let pathFound = false;

    const step = () => {
      const currentTime = Date.now() - startTime;

      if (queue.length === 0 || pathFound) {
        onComplete(currentTime, "BFS");
        return;
      }

      const [x, y] = queue.shift()!;

      if (currentMaze[y][x] === "end") {
        console.log("BFS: Path found!");
        pathFound = true;
        onComplete(currentTime, "BFS");
        return;
      }

      if (currentMaze[y][x] === "path") {
        currentMaze[y][x] = "visited";
        onUpdateMaze([...currentMaze.map((row) => [...row])]);
      }

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
          nx < gridWidth &&
          ny >= 0 &&
          ny < gridHeight &&
          !visited.has(`${nx}, ${ny}`) &&
          (currentMaze[ny][nx] === "path" || currentMaze[ny][nx] === "end")
        ) {
          visited.add(`${nx}, ${ny}`);
          queue.push([nx, ny]);
        }
      }

      if (!pathFound) {
        const timeoutId = setTimeout(step, 100);
        onSetTimeout(timeoutId as unknown as number);
      }
    };

    step();
  };

  const dfs = (
    startNode: number[],
    maze: string[][],
    onUpdateMaze: (maze: string[][]) => void,
    onComplete: (time: number, algorithm: string) => void,
    onSetTimeout: (id: number) => void
  ) => {
    const startTime = Date.now();
    const gridHeight = maze.length;
    const gridWidth = gridHeight > 0 ? maze[0].length : 0;
    const stack = [startNode];
    const visited = new Set([`${startNode[0]}, ${startNode[1]}`]);
    let currentMaze = [...maze.map((row) => [...row])];
    let pathFound = false;

    const step = () => {
      const currentTime = Date.now() - startTime;

      if (stack.length === 0 || pathFound) {
        onComplete(currentTime, "DFS");
        return;
      }

      const [x, y] = stack.pop()!;
      console.log("DFS visiting:", x, y);

      if (currentMaze[y][x] === "end") {
        console.log("DFS: Path found!");
        pathFound = true;
        onComplete(currentTime, "DFS");
        return;
      }

      if (currentMaze[y][x] === "path") {
        currentMaze[y][x] = "visited";
        onUpdateMaze([...currentMaze.map((row) => [...row])]);
      }

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);

      for (const [dx, dy] of shuffledDirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < gridWidth &&
          ny >= 0 &&
          ny < gridHeight &&
          !visited.has(`${nx}, ${ny}`) &&
          (currentMaze[ny][nx] === "path" || currentMaze[ny][nx] === "end")
        ) {
          visited.add(`${nx}, ${ny}`);
          stack.push([nx, ny]);
        }
      }

      if (!pathFound) {
        const timeoutId = setTimeout(step, 100);
        onSetTimeout(timeoutId as unknown as number);
      }
    };

    step();
  };

  return { bfs, dfs };
}
