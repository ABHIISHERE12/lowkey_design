const problems = [
  {
    id: 'parking-lot',
    title: 'Parking Lot',
    statement:
      'Design a parking lot system that can manage multiple floors, parking spots and different vehicle types. The system should assign suitable spots, handle vehicle entry and exit, and calculate parking fees.',
    requirements: [
      'Support multiple floors and parking spots',
      'Handle different vehicle types',
      'Assign a suitable parking spot on entry',
      'Handle vehicle exit',
      'Calculate parking fees',
    ],
  },
  {
    id: 'library',
    title: 'Library Management System',
    statement:
      'Design a library management system where members can borrow, return, and reserve books. The system must handle due dates, fines, book availability, and multiple copies of the same book.',
    requirements: [
      'Track books, members, and copies',
      'Support borrow, return, and reservation flows',
      'Handle due dates and fines',
      'Track book availability and multiple copies',
    ],
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    statement:
      'Design a flexible Tic Tac Toe game. It should support N x N grid sizes, multiple players with different symbols, and extensible winning strategies.',
    requirements: [
      'Support an N x N board',
      'Support multiple players with different symbols',
      'Allow extensible winning strategies',
      'Keep game flow independent of a hardcoded 3x3 board',
    ],
  },
  {
    id: 'atm',
    title: 'ATM',
    statement:
      'Design an Automated Teller Machine (ATM) system. It must securely authenticate users, check balances, allow cash withdrawals using a chain of responsibility, and maintain transactional integrity.',
    requirements: [
      'Authenticate card holders securely',
      'Check account balances',
      'Support cash withdrawal',
      'Maintain transactional integrity',
    ],
  },
  {
    id: 'coffee-machine',
    title: 'Coffee Machine',
    statement:
      'Design a configurable coffee machine. It should support various drinks, manage ingredient inventory, and accept different forms of payment.',
    requirements: [
      'Support multiple beverages',
      'Manage ingredient inventory',
      'Accept different payment methods',
      'Remain configurable for new drinks',
    ],
  },
  {
    id: 'elevator-system',
    title: 'Elevator System',
    statement:
      'Design a control system for multiple elevators in a multi-story building. The system should manage requests from inside and outside the elevators, optimize the movement of elevator cars, and handle edge cases like weight limits and emergencies.',
    requirements: [
      'Support multiple elevator cars and floors',
      'Handle inside and outside requests',
      'Dispatch cars with a reasonable scheduling strategy',
      'Handle edge cases such as weight limits and emergencies',
    ],
  },
];

const getProblemById = (problemId) => {
  const problem = problems.find((item) => item.id === problemId);
  if (problem) return problem;

  return {
    id: problemId,
    title: problemId,
    statement: `Design a solution for problem "${problemId}".`,
    requirements: ['Address the core entities and relationships implied by the problem.'],
  };
};

module.exports = {
  problems,
  getProblemById,
};
