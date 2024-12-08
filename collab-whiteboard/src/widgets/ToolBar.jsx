// src/components/ToolBar.js
import React from 'react';
import '../widgets_css/ToolBar.css';

function ToolBar({ setColor, setLineWidth, setTool, clearCanvas, undo, redo }) {
  return (
    <div className="toolbar">
      {/* Color picker */}
      <input
        type="color"
        onChange={(e) => setColor(e.target.value)}
        defaultValue="#000000"
      />

      {/* Line width range */}
      <input
        type="range"
        min="1"
        max="20"
        defaultValue="2"
        onChange={(e) => setLineWidth(parseInt(e.target.value))}
      />

      {/* Tool buttons */}
      <button className="tool-button" onClick={() => setTool('polyline')}>
        Free Stroke
      </button>

      <button className="tool-button" onClick={() => setTool('line')}>
        Line
      </button>
      <button className="tool-button" onClick={() => setTool('rectangle')}>
        Rectangle
      </button>
      <button className="tool-button" onClick={() => setTool('circle')}>
        Circle
      </button>
      <button className='tool-button' onClick={(activateEraser) => setTool('eraser')}>
        Eraser
      </button>
      <button className="tool-button" onClick={undo}>
        Undo
      </button>
      <button className="tool-button" onClick={redo}>
        Redo
      </button>
      {/* Add more buttons for different shapes if needed */}

      {/* Delete (Clear) Button */}
      <button className="tool-button delete-button" onClick={clearCanvas}>Delete</button> {/* This calls the clearCanvas function */}
    </div>
  );
}

export default ToolBar;
