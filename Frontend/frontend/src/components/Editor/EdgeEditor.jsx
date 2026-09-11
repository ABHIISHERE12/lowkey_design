import React from 'react';
import './NodeEditor.css'; // Reusing NodeEditor styling

const EdgeEditor = ({ edge, updateEdgeData, deleteEdge, nodes }) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  return (
    <div className="node-editor">
      <div className="editor-header-bar">
        <h3 className="editor-title">EDIT RELATIONSHIP</h3>
      </div>

      <div className="editor-content">
        <div className="form-group">
          <label>Type</label>
          <select 
            className="text-input" 
            value={edge.data?.relationshipType || 'association'} 
            onChange={(e) => updateEdgeData(edge.id, { relationshipType: e.target.value })}
          >
            <option value="inheritance">Inheritance</option>
            <option value="implementation">Implementation</option>
            <option value="association">Association</option>
            <option value="aggregation">Aggregation</option>
            <option value="composition">Composition</option>
            <option value="dependency">Dependency</option>
          </select>
        </div>

        <div className="form-group">
          <label>Source Node</label>
          <div 
            className="text-input" 
            style={{ backgroundColor: '#f0f0f0', color: '#666', pointerEvents: 'none' }}
          >
            {sourceNode?.data?.name || edge.source}
          </div>
        </div>

        <div className="form-group">
          <label>Target Node</label>
          <div 
            className="text-input" 
            style={{ backgroundColor: '#f0f0f0', color: '#666', pointerEvents: 'none' }}
          >
            {targetNode?.data?.name || edge.target}
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <button className="delete-node-btn" onClick={() => deleteEdge(edge.id)}>
          Delete Relationship
        </button>
      </div>
    </div>
  );
};

export default EdgeEditor;
