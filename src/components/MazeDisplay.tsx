interface MazeDisplayProps {
  maze: string[][];
}

export function MazeDisplay({ maze }: MazeDisplayProps) {
  return (
    <div className="maze" data-testid="maze-display">
      {maze.map((row, rowIndex) => (
        <div className="row" key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <div className={`cell ${cell}`} key={`cell-${cellIndex}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
