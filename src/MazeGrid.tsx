import { useEffect, useState } from "react";
import "./App.css";
import { Timer } from "./components/Timer";
import { RecordsTable } from "./components/RecordsTable";
import { ControlPanel } from "./components/ControlPanel";
import { MazeDisplay } from "./components/MazeDisplay";
import { usePathfindingAlgorithms } from "./hooks/usePathfindingAlgorithms";
import { useMazeGenerator } from "./hooks/useMazeGenerator";

interface SessionResult {
  algorithm: string;
  time: number;
  timestamp: string;
}

function MazeGrid({ width = 15, height = 15 }) {
  const [maze, setMaze] = useState<string[][]>([]);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>("");
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showRecordsTable, setShowRecordsTable] = useState(false);

  const { generateMaze: generateMazeMatrix } = useMazeGenerator(width, height);
  const algorithms = usePathfindingAlgorithms();

  useEffect(() => {
    handleGenerateMaze();
  }, []);

  const handleGenerateMaze = () => {
    // Clear any timeout from the queue before refresh the Maze to avoid the ongoing loop of timeout
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    setIsRunning(false);

    const newMaze = generateMazeMatrix();
    setMaze(newMaze);
  };

  const handleAlgorithmComplete = (time: number, algorithm: string) => {
    setIsRunning(false);
    const timestamp = new Date().toLocaleTimeString();
    setSessionResults((prev) => [...prev, { algorithm, time, timestamp }]);
    console.log(`Recording: ${algorithm} - ${time}ms at ${timestamp}`);
  };

  const handleSetTimeout = (id: number) => {
    setTimeoutIds((prev) => [...prev, id]);
  };

  const handleStartBFS = () => {
    setCurrentAlgorithm("BFS");
    setIsRunning(true);
    algorithms.bfs(
      [1, 0],
      maze,
      setMaze,
      handleAlgorithmComplete,
      handleSetTimeout
    );
  };

  const handleStartDFS = () => {
    setCurrentAlgorithm("DFS");
    setIsRunning(true);
    algorithms.dfs(
      [1, 0],
      maze,
      setMaze,
      handleAlgorithmComplete,
      handleSetTimeout
    );
  };

  const handleTimerUpdate = (_time: number) => {
    // Timer updates are handled by the Timer component itself
    // This could be used for additional logic if needed
  };

  const handleClearResults = () => {
    setSessionResults([]);
  };

  const handleToggleRecords = () => {
    setShowRecordsTable(!showRecordsTable);
  };

  return (
    <div className="maze-container" style={{ display: "flex", gap: "20px" }}>
      <RecordsTable
        isVisible={showRecordsTable}
        sessionResults={sessionResults}
        onClose={() => setShowRecordsTable(false)}
        onClearResults={handleClearResults}
      />

      <div className="maze-grid" style={{ flex: 1 }}>
        <ControlPanel
          onGenerateMaze={handleGenerateMaze}
          onStartBFS={handleStartBFS}
          onStartDFS={handleStartDFS}
          showRecordsTable={showRecordsTable}
          onToggleRecords={handleToggleRecords}
        />

        <Timer
          isRunning={isRunning}
          currentAlgorithm={currentAlgorithm}
          onTimerUpdate={handleTimerUpdate}
        />

        <MazeDisplay maze={maze} />
      </div>
    </div>
  );
}

export default MazeGrid;
