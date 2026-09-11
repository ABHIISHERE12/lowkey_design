import React from 'react';
import './EditorSidebar.css';

const nodeTypes = [
  { type: 'class', label: 'Class', icon: 'C' },
  { type: 'interface', label: 'Interface', icon: 'I' },
  { type: 'abstract', label: 'Abstract Class', icon: 'A' },
  { type: 'enum', label: 'Enum', icon: 'E' },
];

const edgeTypes = [
  { type: 'inheritance', label: 'Inheritance', color: '#3b82f6' },
  { type: 'implementation', label: 'Implementation', color: '#22c55e' },
  { type: 'association', label: 'Association', color: '#475569' },
  { type: 'aggregation', label: 'Aggregation', color: '#f97316' },
  { type: 'composition', label: 'Composition', color: '#ef4444' },
  { type: 'dependency', label: 'Dependency', color: '#a855f7' },
];

const EditorSidebar = ({ onAddNode, onAddChildClass, selectedEdgeType, setSelectedEdgeType, onClear }) => {
  return (
    <aside className="editor-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">INSERT</h3>
        <div className="sidebar-grid">
          {nodeTypes.map((item) => (
            <button 
              key={item.type}
              type="button"
              className="sidebar-btn node-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onAddNode(item.type, item.label)}
            >
              <span className="btn-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <button className="sidebar-btn child-class-btn" onClick={onAddChildClass} style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center', backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px dashed #7dd3fc' }}>
          <span className="btn-icon">↳</span> Auto Child Class
        </button>
        <button className="sidebar-btn clear-btn" onClick={onClear} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
          🗑 Clear Editor
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">RELATIONSHIPS</h3>
        <div className="sidebar-list">
          {edgeTypes.map((item) => (
            <button 
              key={item.type} 
              className={`sidebar-btn edge-btn ${selectedEdgeType === item.type ? 'active' : ''}`}
              onClick={() => setSelectedEdgeType(item.type)}
            >
              <span className="edge-line" data-type={item.type}></span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, marginRight: '8px', flexShrink: 0 }}></span>
              {item.label}
            </button>
          ))}
        </div>
        <p className="sidebar-help">Drag between node connection points to create relationships.</p>
      </div>

      <div className="sidebar-section">
        <details className="sidebar-collapsible">
          <summary className="sidebar-title" style={{ cursor: 'pointer' }}>DESIGN PATTERNS</summary>
          <div className="sidebar-help">Patterns coming soon...</div>
        </details>
      </div>

      <div className="sidebar-section">
        <details className="sidebar-collapsible">
          <summary className="sidebar-title" style={{ cursor: 'pointer' }}>CLASS ROLES</summary>
          <div className="sidebar-help">Roles coming soon...</div>
        </details>
      </div>
    </aside>
  );
};

export default EditorSidebar;
