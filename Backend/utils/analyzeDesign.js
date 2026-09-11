const getNodeName = (node) => (node.data?.name || '').trim();

const analyzeDesign = (design = {}) => {
  const nodes = Array.isArray(design.nodes) ? design.nodes : [];
  const edges = Array.isArray(design.edges) ? design.edges : [];
  const nodeIds = new Set(nodes.map((node) => node.id).filter(Boolean));

  const classCount = nodes.filter((node) => node.type === 'classNode').length;
  const interfaceCount = nodes.filter((node) => node.type === 'interfaceNode').length;
  const abstractCount = nodes.filter((node) => node.type === 'abstractNode').length;
  const enumCount = nodes.filter((node) => node.type === 'enumNode').length;

  const names = nodes.map(getNodeName).filter(Boolean);
  const seenNames = new Map();
  const duplicateNames = [];
  names.forEach((name) => {
    const key = name.toLowerCase();
    seenNames.set(key, (seenNames.get(key) || 0) + 1);
  });
  seenNames.forEach((count, name) => {
    if (count > 1) {
      duplicateNames.push(name);
    }
  });

  const unnamedNodes = nodes
    .filter((node) => !getNodeName(node))
    .map((node) => node.id || '(missing id)');

  const emptyClasses = nodes
    .filter((node) => node.type === 'classNode' || node.type === 'abstractNode')
    .filter((node) => {
      const attributes = node.data?.attributes || [];
      const methods = node.data?.methods || [];
      return attributes.length === 0 && methods.length === 0;
    })
    .map((node) => getNodeName(node) || node.id);

  const invalidRelationships = edges
    .filter((edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target))
    .map((edge) => ({
      source: edge.source,
      target: edge.target,
      relationshipType: edge.relationshipType || edge.data?.relationshipType || 'unknown',
    }));

  const findings = {
    isEmpty: nodes.length === 0,
    classCount,
    interfaceCount,
    abstractCount,
    enumCount,
    relationshipCount: edges.length,
    unnamedNodes,
    duplicateNames,
    invalidRelationships,
    emptyClasses,
    issues: [],
  };

  if (findings.isEmpty) {
    findings.issues.push('The design has no classes, interfaces, abstract classes, or enums.');
  }
  unnamedNodes.forEach((id) => {
    findings.issues.push(`A node is missing a name (${id}).`);
  });
  duplicateNames.forEach((name) => {
    findings.issues.push(`Duplicate node name: "${name}".`);
  });
  invalidRelationships.forEach((edge) => {
    findings.issues.push(
      `Relationship ${edge.relationshipType} references a missing node (${edge.source} → ${edge.target}).`
    );
  });
  emptyClasses.forEach((name) => {
    findings.issues.push(`Class "${name}" has no attributes or methods.`);
  });

  return findings;
};

module.exports = analyzeDesign;
