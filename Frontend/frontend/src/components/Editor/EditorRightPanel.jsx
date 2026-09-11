import React from 'react';
import NodeEditor from './NodeEditor';
import './EditorRightPanel.css';

const EditorRightPanel = ({ problem, stats, selectedNode, updateNodeData, deleteNode }) => {
  return (
    <aside className="editor-right-panel">
      {selectedNode ? (
        <NodeEditor 
          node={selectedNode} 
          updateNodeData={updateNodeData} 
          deleteNode={deleteNode} 
        />
      ) : (
        <>
          <div className="panel-section problem-info">
            <h3 className="panel-title">PROBLEM STATEMENT</h3>
            <div className="problem-card-mini">
              <div className="problem-header-mini">
                <span className="problem-icon-mini">{problem.icon}</span>
                <h4 className="problem-title-mini">{problem.title}</h4>
              </div>
              <p className="problem-desc-mini">{problem.shortDesc}</p>
              <div className="problem-requirements">
                <h5>Key Requirements:</h5>
                <ul>
                  <li>Identify core entities</li>
                  <li>Define class relationships</li>
                  <li>Encapsulate properties</li>
                  <li>Design extensible methods</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="panel-section design-summary">
            <h3 className="panel-title">DESIGN SUMMARY</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Classes</span>
                <span className="stat-value">{stats.class}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interfaces</span>
                <span className="stat-value">{stats.interface}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Abstract Classes</span>
                <span className="stat-value">{stats.abstract}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Enums</span>
                <span className="stat-value">{stats.enum}</span>
              </div>
              <div className="stat-item total-relationships">
                <span className="stat-label">Relationships</span>
                <span className="stat-value">{stats.relationships}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default EditorRightPanel;
