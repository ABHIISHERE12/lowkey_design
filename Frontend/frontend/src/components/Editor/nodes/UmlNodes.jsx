import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './UmlNodes.css';

const getVisibilitySymbol = (vis) => {
  if (vis === 'private') return '-';
  if (vis === 'protected') return '#';
  if (vis === 'package') return '~';
  return '+'; // public default
};

const BaseUmlNode = ({ data, type, bgColor, stereotype, isAbstract }) => {
  const name = data.name || data.label || 'Unnamed';

  return (
    <div className={`uml-node ${type} ${data.isAutoChild ? 'auto-child-node' : ''}`} style={!data.isAutoChild ? { backgroundColor: bgColor } : {}}>
      <Handle type="source" position={Position.Top} id="top" className="uml-handle" />
      <Handle type="target" position={Position.Top} id="top" className="uml-handle uml-handle-target" />
      <Handle type="source" position={Position.Right} id="right" className="uml-handle" />
      <Handle type="target" position={Position.Right} id="right" className="uml-handle uml-handle-target" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="uml-handle" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="uml-handle uml-handle-target" />
      <Handle type="source" position={Position.Left} id="left" className="uml-handle" />
      <Handle type="target" position={Position.Left} id="left" className="uml-handle uml-handle-target" />
      
      <div className="uml-header">
        {stereotype && <div className="uml-stereotype">{stereotype}</div>}
        <div className="uml-title" style={{ fontStyle: isAbstract ? 'italic' : 'normal' }}>
          {name}
        </div>
      </div>
      
      {!data.enumValues && (
        <div className="uml-section">
          {data.attributes && data.attributes.map((attr, i) => (
            <div key={i} className="uml-line">
              {getVisibilitySymbol(attr.visibility)} {attr.name}: {attr.type}
            </div>
          ))}
          <div className="add-placeholder"><span className="add-icon">+</span> add attribute</div>
        </div>
      )}
      
      {data.enumValues && (
        <div className="uml-section">
          {data.enumValues.map((val, i) => (
            <div key={i} className="uml-line">{val}</div>
          ))}
          <div className="add-placeholder"><span className="add-icon">+</span> add value</div>
        </div>
      )}
      
      {!data.enumValues && (
        <div className="uml-section">
          {data.methods && data.methods.map((method, i) => (
            <div key={i} className="uml-line">
              {method.isOverride && <span className="uml-meta">&lt;&lt;override&gt;&gt; </span>}
              {getVisibilitySymbol(method.visibility)} {method.name}(
              {method.parameters?.map(p => `${p.name}: ${p.type}`).join(', ')}
              ): {method.returnType}
            </div>
          ))}
          <div className="add-placeholder" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><span className="add-icon">+</span> add method</div>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0px 4px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>f</div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export const ClassNode = (props) => (
  <BaseUmlNode {...props} type="class-node" bgColor="#ffffff" />
);

export const AbstractNode = (props) => (
  <BaseUmlNode {...props} type="abstract-node" bgColor="#fef08a" stereotype="&lt;&lt;abstract&gt;&gt;" isAbstract={true} />
);

export const InterfaceNode = (props) => (
  <BaseUmlNode {...props} type="interface-node" bgColor="#bbf7d0" stereotype="&lt;&lt;interface&gt;&gt;" />
);

export const EnumNode = (props) => (
  <BaseUmlNode {...props} type="enum-node" bgColor="#fbcfe8" stereotype="&lt;&lt;enum&gt;&gt;" />
);
