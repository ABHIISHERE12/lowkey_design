import React from 'react';
import './NodeEditor.css';

const NodeEditor = ({ node, updateNodeData, deleteNode }) => {
  const { id, type, data } = node;

  const handleChange = (field, value) => {
    updateNodeData(id, { [field]: value });
  };

  const handleAttributeChange = (idx, field, value) => {
    const newAttrs = [...(data.attributes || [])];
    newAttrs[idx] = { ...newAttrs[idx], [field]: value };
    handleChange('attributes', newAttrs);
  };

  const addAttribute = () => {
    const newAttrs = [...(data.attributes || []), { name: 'newAttr', type: 'String', visibility: 'private' }];
    handleChange('attributes', newAttrs);
  };

  const removeAttribute = (idx) => {
    const newAttrs = [...(data.attributes || [])];
    newAttrs.splice(idx, 1);
    handleChange('attributes', newAttrs);
  };

  const handleMethodChange = (idx, field, value) => {
    const newMethods = [...(data.methods || [])];
    newMethods[idx] = { ...newMethods[idx], [field]: value };
    handleChange('methods', newMethods);
  };

  const addMethod = () => {
    const newMethods = [...(data.methods || []), { 
      name: 'newMethod', 
      returnType: 'void', 
      visibility: 'public', 
      parameters: [], 
      isOverride: false, 
      isOverloaded: false 
    }];
    handleChange('methods', newMethods);
  };

  const removeMethod = (idx) => {
    const newMethods = [...(data.methods || [])];
    newMethods.splice(idx, 1);
    handleChange('methods', newMethods);
  };

  const handleParamChange = (mIdx, pIdx, field, value) => {
    const newMethods = [...(data.methods || [])];
    const newParams = [...(newMethods[mIdx].parameters || [])];
    newParams[pIdx] = { ...newParams[pIdx], [field]: value };
    newMethods[mIdx].parameters = newParams;
    handleChange('methods', newMethods);
  };

  const addParam = (mIdx) => {
    const newMethods = [...(data.methods || [])];
    const newParams = [...(newMethods[mIdx].parameters || []), { name: 'p', type: 'String' }];
    newMethods[mIdx].parameters = newParams;
    handleChange('methods', newMethods);
  };

  const removeParam = (mIdx, pIdx) => {
    const newMethods = [...(data.methods || [])];
    const newParams = [...(newMethods[mIdx].parameters || [])];
    newParams.splice(pIdx, 1);
    newMethods[mIdx].parameters = newParams;
    handleChange('methods', newMethods);
  };

  const handleEnumValueChange = (idx, value) => {
    const newVals = [...(data.enumValues || [])];
    newVals[idx] = value;
    handleChange('enumValues', newVals);
  };

  const addEnumValue = () => {
    const newVals = [...(data.enumValues || []), 'NEW_VALUE'];
    handleChange('enumValues', newVals);
  };

  const removeEnumValue = (idx) => {
    const newVals = [...(data.enumValues || [])];
    newVals.splice(idx, 1);
    handleChange('enumValues', newVals);
  };

  const isEnum = type === 'enumNode';
  const isInterface = type === 'interfaceNode';
  
  let headerLabel = 'EDIT CLASS';
  if (isEnum) headerLabel = 'EDIT ENUM';
  if (isInterface) headerLabel = 'EDIT INTERFACE';
  if (type === 'abstractNode') headerLabel = 'EDIT ABSTRACT CLASS';

  return (
    <div className="node-editor">
      <datalist id="common-types">
        <option value="String" />
        <option value="int" />
        <option value="double" />
        <option value="boolean" />
        <option value="float" />
        <option value="long" />
        <option value="Object" />
        <option value="void" />
      </datalist>

      <div className="editor-header-bar">
        <h3 className="editor-title">{headerLabel}</h3>
      </div>

      <div className="editor-content">
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            className="text-input" 
            value={data.name || ''} 
            onChange={e => handleChange('name', e.target.value)} 
          />
        </div>

        {/* ENUM VALUES */}
        {isEnum && (
          <div className="form-group">
            <label className="section-label">Values</label>
            {(data.enumValues || []).map((val, idx) => (
              <div key={idx} className="list-row">
                <input 
                  type="text" 
                  className="text-input" 
                  value={val} 
                  onChange={e => handleEnumValueChange(idx, e.target.value)} 
                />
                <button className="del-btn" onClick={() => removeEnumValue(idx)}>−</button>
              </div>
            ))}
            <button className="add-btn" onClick={addEnumValue}>+ Add Value</button>
          </div>
        )}

        {/* ATTRIBUTES */}
        {!isEnum && !isInterface && (
          <div className="form-group">
            <label className="section-label">Attributes</label>
            {(data.attributes || []).map((attr, idx) => (
              <div key={idx} className="list-row multi-col">
                <select 
                  className="vis-select" 
                  value={attr.visibility} 
                  onChange={e => handleAttributeChange(idx, 'visibility', e.target.value)}
                >
                  <option value="public">+</option>
                  <option value="private">-</option>
                  <option value="protected">#</option>
                </select>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="name" 
                  value={attr.name} 
                  onChange={e => handleAttributeChange(idx, 'name', e.target.value)} 
                />
                <input 
                  type="text" 
                  list="common-types" 
                  className="text-input" 
                  placeholder="type" 
                  value={attr.type} 
                  onChange={e => handleAttributeChange(idx, 'type', e.target.value)} 
                />
                <button className="del-btn" onClick={() => removeAttribute(idx)}>−</button>
              </div>
            ))}
            <button className="add-btn" onClick={addAttribute}>+ Add Attribute</button>
          </div>
        )}

        {/* METHODS */}
        {!isEnum && (
          <div className="form-group">
            <label className="section-label">Methods</label>
            {(data.methods || []).map((meth, mIdx) => (
              <div key={mIdx} className="method-card">
                <div className="list-row multi-col">
                  <select 
                    className="vis-select" 
                    value={meth.visibility} 
                    onChange={e => handleMethodChange(mIdx, 'visibility', e.target.value)}
                  >
                    <option value="public">+</option>
                    <option value="private">-</option>
                    <option value="protected">#</option>
                  </select>
                  <input 
                    type="text" 
                    className="text-input" 
                    placeholder="name" 
                    value={meth.name} 
                    onChange={e => handleMethodChange(mIdx, 'name', e.target.value)} 
                  />
                  <input 
                    type="text" 
                    list="common-types" 
                    className="text-input" 
                    placeholder="return" 
                    value={meth.returnType} 
                    onChange={e => handleMethodChange(mIdx, 'returnType', e.target.value)} 
                  />
                  <button className="del-btn" onClick={() => removeMethod(mIdx)}>−</button>
                </div>
                
                <div className="method-flags">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={meth.isOverride} 
                      onChange={e => handleMethodChange(mIdx, 'isOverride', e.target.checked)} 
                    />
                    Override
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={meth.isOverloaded} 
                      onChange={e => handleMethodChange(mIdx, 'isOverloaded', e.target.checked)} 
                    />
                    Overloaded
                  </label>
                </div>

                <div className="params-section">
                  <label className="sub-label">Parameters:</label>
                  {(meth.parameters || []).map((param, pIdx) => (
                    <div key={pIdx} className="list-row multi-col param-row">
                      <input 
                        type="text" 
                        className="text-input" 
                        placeholder="name" 
                        value={param.name} 
                        onChange={e => handleParamChange(mIdx, pIdx, 'name', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        list="common-types" 
                        className="text-input" 
                        placeholder="type" 
                        value={param.type} 
                        onChange={e => handleParamChange(mIdx, pIdx, 'type', e.target.value)} 
                      />
                      <button className="del-btn small" onClick={() => removeParam(mIdx, pIdx)}>−</button>
                    </div>
                  ))}
                  <button className="add-btn small" onClick={() => addParam(mIdx)}>+ Add Parameter</button>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addMethod}>+ Add Method</button>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <button className="delete-node-btn" onClick={() => deleteNode(id)}>Delete Node</button>
      </div>
    </div>
  );
};

export default NodeEditor;
