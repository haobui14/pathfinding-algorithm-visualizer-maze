interface ControlPanelProps {
  onGenerateMaze: () => void;
  onStartBFS: () => void;
  onStartDFS: () => void;
  showRecordsTable: boolean;
  onToggleRecords: () => void;
}

export function ControlPanel({ 
  onGenerateMaze, 
  onStartBFS, 
  onStartDFS, 
  showRecordsTable, 
  onToggleRecords 
}: ControlPanelProps) {
  return (
    <div className="button-container">
      <button className="maze-button" onClick={onGenerateMaze}>
        Refresh Maze
      </button>
      <button className="maze-button" onClick={onStartBFS}>
        Start BFS
      </button>
      <button className="maze-button" onClick={onStartDFS}>
        Start DFS
      </button>
      <button 
        className="maze-button" 
        onClick={onToggleRecords}
        style={{ backgroundColor: showRecordsTable ? '#dc3545' : '#6c757d' }}
      >
        {showRecordsTable ? 'Hide Records' : 'Show Records'}
      </button>
    </div>
  );
}
