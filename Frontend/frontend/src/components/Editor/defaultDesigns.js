export const defaultParkingLotNodes = [
  {
    id: 'node_1',
    type: 'abstractNode',
    position: { x: 300, y: 100 },
    data: {
      name: 'Vehicle',
      attributes: [
        { name: 'licenseNumber', type: 'String', visibility: 'private' },
        { name: 'type', type: 'VehicleType', visibility: 'private' }
      ],
      methods: [
        { name: 'getSize', returnType: 'VehicleSize', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false },
        { name: 'getType', returnType: 'VehicleType', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false }
      ]
    }
  },
  {
    id: 'node_2',
    type: 'classNode',
    position: { x: 150, y: 350 },
    data: {
      name: 'Car',
      attributes: [],
      methods: [
        { name: 'getSize', returnType: 'VehicleSize', visibility: 'public', parameters: [], isOverride: true, isOverloaded: false }
      ]
    }
  },
  {
    id: 'node_3',
    type: 'classNode',
    position: { x: 450, y: 350 },
    data: {
      name: 'Bike',
      attributes: [],
      methods: [
        { name: 'getSize', returnType: 'VehicleSize', visibility: 'public', parameters: [], isOverride: true, isOverloaded: false }
      ]
    }
  },
  {
    id: 'node_4',
    type: 'classNode',
    position: { x: 650, y: 100 },
    data: {
      name: 'ParkingSpot',
      attributes: [
        { name: 'id', type: 'String', visibility: 'private' },
        { name: 'isFree', type: 'boolean', visibility: 'private' },
        { name: 'vehicle', type: 'Vehicle', visibility: 'private' },
        { name: 'spotType', type: 'ParkingSpotType', visibility: 'private' }
      ],
      methods: [
        { name: 'assignVehicle', returnType: 'boolean', visibility: 'public', parameters: [{ name: 'v', type: 'Vehicle' }], isOverride: false, isOverloaded: false },
        { name: 'removeVehicle', returnType: 'boolean', visibility: 'public', parameters: [], isOverride: false, isOverloaded: false }
      ]
    }
  }
];

export const defaultParkingLotEdges = [
  {
    id: 'edge_1',
    source: 'node_2',
    target: 'node_1',
    type: 'uml',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    data: { relationshipType: 'inheritance' },
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  {
    id: 'edge_2',
    source: 'node_3',
    target: 'node_1',
    type: 'uml',
    sourceHandle: 'top',
    targetHandle: 'bottom',
    data: { relationshipType: 'inheritance' },
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  }
];
