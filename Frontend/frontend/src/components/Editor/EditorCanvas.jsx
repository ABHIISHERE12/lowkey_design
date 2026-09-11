import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  ReactFlowProvider,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ClassNode, AbstractNode, InterfaceNode, EnumNode } from './nodes/UmlNodes';
import UmlEdge from './edges/UmlEdge';
import EditorControls from './EditorControls';

const nodeTypes = {
  classNode: ClassNode,
  abstractNode: AbstractNode,
  interfaceNode: InterfaceNode,
  enumNode: EnumNode,
};

const edgeTypes = {
  uml: UmlEdge,
};

const isValidConnection = (connection) => connection.source !== connection.target;

const EditorCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onClear, onDeleteSelected }) => {
  return (
    <div style={{ flexGrow: 1, height: '100%', backgroundColor: '#fafafa' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'uml' }}
          connectionMode={ConnectionMode.Loose}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
        >
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <EditorControls onClear={onClear} onDeleteSelected={onDeleteSelected} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default EditorCanvas;
