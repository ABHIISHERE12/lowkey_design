import React from 'react';
import { useReactFlow, Panel } from '@xyflow/react';
import './EditorControls.css';

const EditorControls = ({ onClear, onDeleteSelected }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Panel position="bottom-left" className="editor-controls-panel">
      <button className="control-btn" onClick={() => zoomIn()}>Zoom In</button>
      <button className="control-btn" onClick={() => zoomOut()}>Zoom Out</button>
      <button className="control-btn" onClick={() => fitView({ duration: 200 })}>Fit View</button>
      <div className="control-divider" />
      <button className="control-btn" onClick={onDeleteSelected}>Delete Selected</button>
      <button className="control-btn clear-btn" onClick={onClear}>Clear Canvas</button>
    </Panel>
  );
};

export default EditorControls;