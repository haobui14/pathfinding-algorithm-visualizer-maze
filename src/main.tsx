import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MazeGrid from './MazeGrid';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MazeGrid />
  </StrictMode>
);
