interface SessionResult {
  algorithm: string;
  time: number;
  timestamp: string;
}

interface RecordsTableProps {
  isVisible: boolean;
  sessionResults: SessionResult[];
  onClose: () => void;
  onClearResults: () => void;
}

export function RecordsTable({ isVisible, sessionResults, onClose, onClearResults }: RecordsTableProps) {
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  if (!isVisible) return null;

  return (
    <div className="records-panel" style={{
      minWidth: '300px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: '0' }}>Session Records</h3>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '18px', 
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ✕
        </button>
      </div>
      
      {sessionResults.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No records yet. Run some algorithms!</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Algorithm</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sessionResults.map((result, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      color: result.algorithm === 'BFS' ? '#007bff' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {result.algorithm}
                    </span>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                    {formatTime(result.time)}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '12px', color: '#666' }}>
                    {result.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="maze-button" 
              onClick={onClearResults}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              Clear All
            </button>
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666', alignSelf: 'center' }}>
              Total Runs: {sessionResults.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
