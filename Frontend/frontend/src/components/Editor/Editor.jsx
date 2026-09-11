import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { problems } from '../../data/problems';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import EditorRightPanel from './EditorRightPanel';
import EditorCanvas from './EditorCanvas';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { defaultParkingLotNodes, defaultParkingLotEdges } from './defaultDesigns';
import { getEdgeStyling, pickHandleIds, normalizeEdges, getNewNodePosition, getCreatedRelationshipEndpoints, buildUmlEdge, nextNumericId } from './edges/relationshipUtils';
import SubmitConfirmModal from './SubmitConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { serializeDesign, createSubmission } from '../../api/submissions';
import './Editor.css';

let id = 1;
const getId = () => `node_${id++}`;

const Editor = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problem = useMemo(() => problems.find(p => p.id === problemId) || problems[0], [problemId]);
  const { token } = useAuth();
  
  const onBack = () => navigate('/');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedEdgeType, setSelectedEdgeType] = useState('association');
  const [toastMessage, setToastMessage] = useState('');
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedNodeIdRef = useRef(null);

  /* eslint-disable */
  useEffect(() => {
    if (searchParams.get('fresh') === '1') {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem(`lld_draft_${problem.id}`);
      sessionStorage.setItem(`lld_fresh_${problem.id}`, '1');
      setHasUnsavedChanges(false);
      id = 1;
      navigate(`/editor/${problem.id}`, { replace: true });
      return;
    }

    if (sessionStorage.getItem(`lld_fresh_${problem.id}`) === '1') {
      sessionStorage.removeItem(`lld_fresh_${problem.id}`);
      setNodes([]);
      setEdges([]);
      setHasUnsavedChanges(false);
      id = 1;
      return;
    }

    const saved = localStorage.getItem(`lld_draft_${problem.id}`);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        setNodes(savedNodes || []);
        setEdges(normalizeEdges(savedEdges));
        setHasUnsavedChanges(false);
        // Prevent ID collisions
        id = nextNumericId([...(savedNodes || []), ...(savedEdges || [])], id);
      } catch(e) {
        console.error("Failed to parse saved design", e);
      }
    } else if (problem.id === 'parking-lot') {
      setNodes(defaultParkingLotNodes);
      setEdges(normalizeEdges(defaultParkingLotEdges));
      setHasUnsavedChanges(false);
      id = 10;
    }
  }, [problem.id, setNodes, setEdges, searchParams, navigate]);
  /* eslint-enable */

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = () => {
    localStorage.setItem(`lld_draft_${problem.id}`, JSON.stringify({ nodes, edges }));
    setHasUnsavedChanges(false);
    showToast('Design saved locally.');
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const snapshot = { nodes, edges };
    localStorage.setItem(`lld_draft_${problem.id}`, JSON.stringify(snapshot));
    setHasUnsavedChanges(false);

    try {
      const data = await createSubmission({
        problemId: problem.id,
        design: serializeDesign(nodes, edges),
        token,
      });
      const submissionId = data.submission?._id || data.submission?.id;
      if (!submissionId) {
        throw new Error('Submission was created, but no submission id was returned.');
      }
      navigate(`/submission/${submissionId}`);
    } catch (error) {
      setIsSubmitting(false);
      showToast(error.message || 'Could not submit your design. Please try again.');
    }
  };

  const onClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
      setHasUnsavedChanges(true);
    }
  }, [setNodes, setEdges]);

  const onDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected).map(n => n.id);
    const selectedEdges = edges.filter(e => e.selected).map(e => e.id);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      setNodes(nds => nds.filter(n => !n.selected));
      setEdges(eds => eds.filter(e => !e.selected && !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target)));
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, setNodes, setEdges]);

  const resolveSelectedNode = useCallback(() => {
    const selected = nodes.find(n => n.selected);
    if (selected) {
      selectedNodeIdRef.current = selected.id;
      return selected;
    }
    return nodes.find(n => n.id === selectedNodeIdRef.current) || null;
  }, [nodes]);

  const onConnect = useCallback(
    (params) => {
      const relationshipType = selectedEdgeType;
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      const handles = sourceNode && targetNode ? pickHandleIds(sourceNode, targetNode) : {};
      const edgeId = `edge_${id++}`;
      const newEdge = {
        ...params,
        id: edgeId,
        type: 'uml',
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        data: { relationshipType },
        ...getEdgeStyling(relationshipType)
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setHasUnsavedChanges(true);
    },
    [selectedEdgeType, setEdges, nodes],
  );

  const onAddNode = useCallback((type, label) => {
    const parentNode = resolveSelectedNode();
    id = nextNumericId([...nodes, ...edges], id);
    const newNodeId = getId();
    
    let position = { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 };
    if (parentNode) {
      position = getNewNodePosition(parentNode, selectedEdgeType);
    }

    const newNode = {
      id: newNodeId,
      position,
      type: `${type}Node`,
      data: { name: `New${label.replace(/\s+/g, '')}${id - 1}` },
    };
    
    if (type === 'class') {
      newNode.data.attributes = [{ name: 'id', type: 'String', visibility: 'private' }];
      newNode.data.methods = [{ name: 'getId', returnType: 'String', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false }];
    } else if (type === 'abstract') {
      newNode.data.attributes = [{ name: 'id', type: 'String', visibility: 'protected' }];
      newNode.data.methods = [{ name: 'abstractMethod', returnType: 'void', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false }];
    } else if (type === 'interface') {
      newNode.data.methods = [{ name: 'doSomething', returnType: 'void', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false }];
    } else if (type === 'enum') {
      newNode.data.enumValues = ['VALUE_1', 'VALUE_2'];
    }

    let newEdge = null;
    if (parentNode) {
      const relationshipType = selectedEdgeType;
      const { sourceNode, targetNode } = getCreatedRelationshipEndpoints(
        relationshipType,
        parentNode,
        newNode
      );
      newEdge = buildUmlEdge(`edge_${id++}`, relationshipType, sourceNode, targetNode);
    }

    setNodes((nds) => nds
      .map(n => ({ ...n, selected: parentNode ? n.id === parentNode.id : false }))
      .concat({ ...newNode, selected: false }));
    if (newEdge) {
      setEdges((eds) => eds.concat(newEdge));
    }
    setHasUnsavedChanges(true);
  }, [nodes, edges, setNodes, setEdges, selectedEdgeType, resolveSelectedNode]);

  const onAddChildClass = useCallback(() => {
    const parentNode = resolveSelectedNode();
    if (!parentNode) {
      showToast('Select a parent class first to create a child.');
      return;
    }

    id = nextNumericId([...nodes, ...edges], id);
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      position: { x: parentNode.position.x, y: parentNode.position.y + 150 },
      type: 'classNode',
      data: { 
        name: `ChildOf${parentNode.data.name}`,
        attributes: [],
        methods: [],
        isAutoChild: true
      },
    };

    const newEdge = buildUmlEdge(
      `edge_${id++}`,
      'child-inheritance',
      newNode,
      parentNode
    );

    setNodes((nds) => nds
      .map(n => ({ ...n, selected: n.id === parentNode.id }))
      .concat({ ...newNode, selected: false }));
    setEdges((eds) => eds.concat(newEdge));
    setHasUnsavedChanges(true);
  }, [nodes, edges, setNodes, setEdges, resolveSelectedNode]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n));
    setHasUnsavedChanges(true);
  }, [setNodes]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setHasUnsavedChanges(true);
  }, [setNodes, setEdges]);

  const updateEdgeData = useCallback((edgeId, newData) => {
    setEdges((eds) => eds.map(e => {
      if (e.id === edgeId) {
        const relType = newData.relationshipType || e.data?.relationshipType;
        return {
          ...e,
          type: 'uml',
          markerEnd: undefined,
          markerStart: undefined,
          data: { ...e.data, ...newData },
          ...getEdgeStyling(relType)
        };
      }
      return e;
    }));
    setHasUnsavedChanges(true);
  }, [setEdges]);

  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter(e => e.id !== edgeId));
    setHasUnsavedChanges(true);
  }, [setEdges]);

  const selectedNode = nodes.find(n => n.selected);
  const selectedEdge = edges.find(e => e.selected);

  // Calculate stats
  const stats = useMemo(() => {
    let classCount = 0;
    let interfaceCount = 0;
    let abstractCount = 0;
    let enumCount = 0;

    nodes.forEach(node => {
      if (node.type === 'classNode') classCount++;
      if (node.type === 'interfaceNode') interfaceCount++;
      if (node.type === 'abstractNode') abstractCount++;
      if (node.type === 'enumNode') enumCount++;
    });

    return {
      class: classCount,
      interface: interfaceCount,
      abstract: abstractCount,
      enum: enumCount,
      relationships: edges.length
    };
  }, [nodes, edges]);

  return (
    <div className="editor-layout">
      <EditorHeader 
        problem={problem} 
        onBack={onBack} 
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onSubmit={handleSubmit}
        onToggleLeft={() => setLeftOpen(!leftOpen)}
        onToggleRight={() => setRightOpen(!rightOpen)}
      />
      <div className="editor-body">
        <div className={`sidebar-wrapper ${leftOpen ? 'open' : ''}`}>
          <EditorSidebar 
            onAddNode={onAddNode} 
            onAddChildClass={onAddChildClass}
            selectedEdgeType={selectedEdgeType} 
            setSelectedEdgeType={setSelectedEdgeType} 
            onClear={onClear}
          />
        </div>
        <main className="editor-main">
          <EditorCanvas 
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              onNodesChange(changes);
              setHasUnsavedChanges(true);
            }}
            onEdgesChange={(changes) => {
              onEdgesChange(changes);
              setHasUnsavedChanges(true);
            }}
            onConnect={onConnect}
            onClear={onClear}
            onDeleteSelected={onDeleteSelected}
          />
          {toastMessage && (
            <div className="editor-toast">{toastMessage}</div>
          )}
        </main>
        <div className={`right-panel-wrapper ${rightOpen ? 'open' : ''}`}>
          <EditorRightPanel 
            problem={problem} 
            stats={stats} 
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            updateNodeData={updateNodeData}
            updateEdgeData={updateEdgeData}
            deleteNode={deleteNode}
            deleteEdge={deleteEdge}
            nodes={nodes}
          />
        </div>
      </div>
      {showSubmitModal && (
        <SubmitConfirmModal
          submitting={isSubmitting}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </div>
  );
};

export default Editor;
