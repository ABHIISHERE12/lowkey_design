import { BaseEdge, useInternalNode } from '@xyflow/react';
import {
  getCardinalConnectionPoints,
  getRelationshipSpec,
  offsetAlong,
} from './relationshipUtils';

const MARKER_SIZE = {
  diamond: 16,
  triangle: 14,
  'open-arrow': 12,
};

const RelationshipMarker = ({ kind, x, y, angleDeg, color, filled }) => {
  const transform = `translate(${x}, ${y}) rotate(${angleDeg})`;

  if (kind === 'diamond') {
    return (
      <polygon
        points={`0,0 ${MARKER_SIZE.diamond / 2},${MARKER_SIZE.diamond / 2} ${MARKER_SIZE.diamond},0 ${MARKER_SIZE.diamond / 2},${-MARKER_SIZE.diamond / 2}`}
        fill={filled ? color : '#fff'}
        stroke={color}
        strokeWidth="1.5"
        transform={transform}
      />
    );
  }

  if (kind === 'triangle') {
    return (
      <polygon
        points={`-${MARKER_SIZE.triangle},${-MARKER_SIZE.triangle / 2} 0,0 -${MARKER_SIZE.triangle},${MARKER_SIZE.triangle / 2}`}
        fill={filled ? color : '#fff'}
        stroke={color}
        strokeWidth="1.5"
        transform={transform}
      />
    );
  }

  if (kind === 'open-arrow') {
    return (
      <polyline
        points={`-${MARKER_SIZE['open-arrow']},${-MARKER_SIZE['open-arrow'] / 2} 0,0 -${MARKER_SIZE['open-arrow']},${MARKER_SIZE['open-arrow'] / 2}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        transform={transform}
      />
    );
  }

  return null;
};

const UmlEdge = ({ id, source, target, data, style, selected }) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  const { source: start, target: end } = getCardinalConnectionPoints(sourceNode, targetNode);
  const spec = getRelationshipSpec(data?.relationshipType);
  const angleDeg = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;

  let lineStart = start;
  let lineEnd = end;
  let startMarker = null;
  let endMarker = null;

  if (spec.marker === 'diamond-start') {
    lineStart = offsetAlong(start, end, MARKER_SIZE.diamond);
    startMarker = (
      <RelationshipMarker
        kind="diamond"
        x={start.x}
        y={start.y}
        angleDeg={angleDeg}
        color={spec.stroke}
        filled={spec.fillMarker}
      />
    );
  } else if (spec.marker === 'triangle-end') {
    lineEnd = offsetAlong(end, start, MARKER_SIZE.triangle);
    endMarker = (
      <RelationshipMarker
        kind="triangle"
        x={end.x}
        y={end.y}
        angleDeg={angleDeg}
        color={spec.stroke}
        filled={spec.fillMarker}
      />
    );
  } else if (spec.marker === 'open-arrow-end') {
    lineEnd = offsetAlong(end, start, MARKER_SIZE['open-arrow']);
    endMarker = (
      <RelationshipMarker
        kind="open-arrow"
        x={end.x}
        y={end.y}
        angleDeg={angleDeg}
        color={spec.stroke}
        filled={false}
      />
    );
  }

  const path = `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          ...style,
          stroke: spec.stroke,
          strokeWidth: selected ? spec.strokeWidth + 1 : spec.strokeWidth,
          strokeDasharray: spec.dash || undefined,
        }}
        interactionWidth={24}
      />
      {startMarker}
      {endMarker}
    </>
  );
};

export default UmlEdge;
