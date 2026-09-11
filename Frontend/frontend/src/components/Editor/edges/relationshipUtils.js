export const RELATIONSHIP_STYLES = {
  inheritance: {
    stroke: '#3b82f6',
    strokeWidth: 2,
    dash: null,
    marker: 'triangle-end',
    fillMarker: false,
  },
  implementation: {
    stroke: '#22c55e',
    strokeWidth: 2,
    dash: '5,5',
    marker: 'triangle-end',
    fillMarker: false,
  },
  aggregation: {
    stroke: '#f97316',
    strokeWidth: 2,
    dash: null,
    marker: 'diamond-start',
    fillMarker: false,
  },
  composition: {
    stroke: '#ef4444',
    strokeWidth: 2,
    dash: null,
    marker: 'diamond-start',
    fillMarker: true,
  },
  dependency: {
    stroke: '#a855f7',
    strokeWidth: 2,
    dash: '5,5',
    marker: 'open-arrow-end',
    fillMarker: false,
  },
  association: {
    stroke: '#475569',
    strokeWidth: 2,
    dash: null,
    marker: 'none',
    fillMarker: false,
  },
  'child-inheritance': {
    stroke: '#22c55e',
    strokeWidth: 2,
    dash: null,
    marker: 'triangle-end',
    fillMarker: true,
  },
};

export const getEdgeStyling = (type) => {
  const spec = RELATIONSHIP_STYLES[type] || RELATIONSHIP_STYLES.association;
  return {
    style: {
      stroke: spec.stroke,
      strokeWidth: spec.strokeWidth,
      ...(spec.dash ? { strokeDasharray: spec.dash } : {}),
    },
  };
};

export const getRelationshipSpec = (type) =>
  RELATIONSHIP_STYLES[type] || RELATIONSHIP_STYLES.association;

export const normalizeEdges = (savedEdges) =>
  (savedEdges || []).map((edge) => {
    const relationshipType = edge.data?.relationshipType || 'association';
    return {
      ...edge,
      type: 'uml',
      markerEnd: undefined,
      markerStart: undefined,
      data: { ...edge.data, relationshipType },
      ...getEdgeStyling(relationshipType),
    };
  });

const FALLBACK_WIDTH = 220;
const FALLBACK_HEIGHT = 120;

export const getNodeRect = (node) => {
  const width =
    node.measured?.width ??
    node.width ??
    node.internals?.userNode?.measured?.width ??
    FALLBACK_WIDTH;
  const height =
    node.measured?.height ??
    node.height ??
    node.internals?.userNode?.measured?.height ??
    FALLBACK_HEIGHT;
  const x = node.internals?.positionAbsolute?.x ?? node.positionAbsolute?.x ?? node.position?.x ?? 0;
  const y = node.internals?.positionAbsolute?.y ?? node.positionAbsolute?.y ?? node.position?.y ?? 0;

  return {
    x,
    y,
    width,
    height,
    cx: x + width / 2,
    cy: y + height / 2,
  };
};

const portPoint = (rect, side) => {
  switch (side) {
    case 'top':
      return { x: rect.cx, y: rect.y };
    case 'bottom':
      return { x: rect.cx, y: rect.y + rect.height };
    case 'left':
      return { x: rect.x, y: rect.cy };
    case 'right':
    default:
      return { x: rect.x + rect.width, y: rect.cy };
  }
};

export const pickCardinalSides = (sourceNode, targetNode) => {
  const sourceRect = getNodeRect(sourceNode);
  const targetRect = getNodeRect(targetNode);
  const dx = targetRect.cx - sourceRect.cx;
  const dy = targetRect.cy - sourceRect.cy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceSide: 'right', targetSide: 'left' }
      : { sourceSide: 'left', targetSide: 'right' };
  }

  return dy >= 0
    ? { sourceSide: 'bottom', targetSide: 'top' }
    : { sourceSide: 'top', targetSide: 'bottom' };
};

export const pickHandleIds = (sourceNode, targetNode) => {
  const { sourceSide, targetSide } = pickCardinalSides(sourceNode, targetNode);
  return { sourceHandle: sourceSide, targetHandle: targetSide };
};

export const getCardinalConnectionPoints = (sourceNode, targetNode) => {
  const sourceRect = getNodeRect(sourceNode);
  const targetRect = getNodeRect(targetNode);
  const { sourceSide, targetSide } = pickCardinalSides(sourceNode, targetNode);
  return {
    source: portPoint(sourceRect, sourceSide),
    target: portPoint(targetRect, targetSide),
    sourceSide,
    targetSide,
  };
};

export const offsetAlong = (from, to, distance) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: from.x + (dx / len) * distance,
    y: from.y + (dy / len) * distance,
  };
};

const VERTICAL_RELATIONSHIPS = new Set(['inheritance', 'implementation', 'child-inheritance']);

export const getNewNodePosition = (selectedNode, relationshipType) => {
  if (VERTICAL_RELATIONSHIPS.has(relationshipType)) {
    return { x: selectedNode.position.x, y: selectedNode.position.y + 180 };
  }
  return { x: selectedNode.position.x + 320, y: selectedNode.position.y };
};

export const getCreatedRelationshipEndpoints = (relationshipType, selectedNode, newNode) => {
  if (relationshipType === 'inheritance' || relationshipType === 'child-inheritance') {
    return { sourceNode: newNode, targetNode: selectedNode };
  }

  if (relationshipType === 'implementation') {
    if (selectedNode.type === 'interfaceNode') {
      return { sourceNode: newNode, targetNode: selectedNode };
    }
    return { sourceNode: selectedNode, targetNode: newNode };
  }

  return { sourceNode: selectedNode, targetNode: newNode };
};

export const buildUmlEdge = (id, relationshipType, sourceNode, targetNode) => {
  const handles = pickHandleIds(sourceNode, targetNode);
  return {
    id,
    source: sourceNode.id,
    target: targetNode.id,
    type: 'uml',
    sourceHandle: handles.sourceHandle,
    targetHandle: handles.targetHandle,
    data: { relationshipType },
    ...getEdgeStyling(relationshipType),
  };
};

export const nextNumericId = (items, fallback = 1) => {
  const nums = (items || [])
    .map((item) => {
      const match = String(item.id || '').match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : NaN;
    })
    .filter((num) => !Number.isNaN(num));
  return nums.length ? Math.max(...nums, fallback) + 1 : fallback;
};
