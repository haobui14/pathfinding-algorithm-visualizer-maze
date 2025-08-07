export type Grid = string[][];

const directions: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export function bfs(grid: Grid, start: [number, number]): boolean {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const queue: [number, number][] = [start];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);

  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (grid[y][x] === 'end') {
      return true;
    }
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        !visited.has(`${nx},${ny}`)
      ) {
        const cell = grid[ny][nx];
        if (cell !== 'wall') {
          if (cell === 'end') {
            return true;
          }
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
    }
  }
  return false;
}

export function dfs(grid: Grid, start: [number, number]): boolean {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const stack: [number, number][] = [start];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);

  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (grid[y][x] === 'end') {
      return true;
    }
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        !visited.has(`${nx},${ny}`)
      ) {
        const cell = grid[ny][nx];
        if (cell !== 'wall') {
          if (cell === 'end') {
            return true;
          }
          visited.add(`${nx},${ny}`);
          stack.push([nx, ny]);
        }
      }
    }
  }
  return false;
}

