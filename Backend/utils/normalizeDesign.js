const normalizeDesign = (design = {}) => {
  const nodes = Array.isArray(design.nodes) ? design.nodes : [];
  const edges = Array.isArray(design.edges) ? design.edges : [];

  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: {
        x: Number(node.position?.x) || 0,
        y: Number(node.position?.y) || 0,
      },
      data: {
        name: node.data?.name || '',
        attributes: Array.isArray(node.data?.attributes) ? node.data.attributes : [],
        methods: Array.isArray(node.data?.methods) ? node.data.methods : [],
        enumValues: Array.isArray(node.data?.enumValues) ? node.data.enumValues : [],
      },
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      relationshipType: edge.relationshipType || edge.data?.relationshipType || 'association',
    })),
  };
};

module.exports = normalizeDesign;
