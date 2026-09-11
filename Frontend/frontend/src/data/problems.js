export const problems = [
  {
    id: 'parking-lot',
    title: 'Parking Lot',
    difficulty: 'MEDIUM',
    shortDesc: 'Design a parking system with vehicles, parking spots, floors, tickets and fee calculation.',
    longDesc: 'Design a parking lot system that can manage multiple floors, parking spots and different vehicle types. The system should assign suitable spots, handle vehicle entry and exit, and calculate parking fees.',
    time: '~30 min',
    icon: '🚗',
    color: '#fef08a', // pastel yellow
    attempts: 2,
    bestScore: 8.2,
    history: [
      { id: 1, score: 6.4, date: 'Sep 8, 2026' },
      { id: 2, score: 8.2, date: 'Sep 10, 2026' }
    ]
  },
  {
    id: 'library',
    title: 'Library Management System',
    difficulty: 'MEDIUM',
    shortDesc: 'Design a library system to track books, members, borrowing, and reservations.',
    longDesc: 'Design a library management system where members can borrow, return, and reserve books. The system must handle due dates, fines, book availability, and multiple copies of the same book.',
    time: '~45 min',
    icon: '📚',
    color: '#bbf7d0', // pastel green
    attempts: 1,
    bestScore: 7.4,
    history: [
      { id: 1, score: 7.4, date: 'Sep 1, 2026' }
    ]
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    difficulty: 'EASY',
    shortDesc: 'Design a scalable Tic Tac Toe game with an N x N board and multiplayer support.',
    longDesc: 'Design a flexible Tic Tac Toe game. It should support N x N grid sizes, multiple players with different symbols, and extensible winning strategies.',
    time: '~20 min',
    icon: '❌',
    color: '#fbcfe8', // pastel pink
    attempts: 3,
    bestScore: 8.7,
    history: [
      { id: 1, score: 5.0, date: 'Aug 20, 2026' },
      { id: 2, score: 7.2, date: 'Aug 22, 2026' },
      { id: 3, score: 8.7, date: 'Aug 25, 2026' }
    ]
  },
  {
    id: 'atm',
    title: 'ATM',
    difficulty: 'HARD',
    shortDesc: 'Design an ATM system handling card authentication, cash withdrawal, and transactions.',
    longDesc: 'Design an Automated Teller Machine (ATM) system. It must securely authenticate users, check balances, allow cash withdrawals using a chain of responsibility, and maintain transactional integrity.',
    time: '~60 min',
    icon: '🏧',
    color: '#ddd6fe', // pastel purple
    attempts: 0,
    bestScore: null,
    history: []
  },
  {
    id: 'coffee-machine',
    title: 'Coffee Machine',
    difficulty: 'EASY',
    shortDesc: 'Design a coffee machine that handles different beverages, ingredients, and payments.',
    longDesc: 'Design a configurable coffee machine. It should support various drinks, manage ingredient inventory, and accept different forms of payment.',
    time: '~25 min',
    icon: '☕',
    color: '#bfdbfe', // pastel blue
    attempts: 1,
    bestScore: 6.9,
    history: [
      { id: 1, score: 6.9, date: 'Sep 5, 2026' }
    ]
  },
  {
    id: 'elevator-system',
    title: 'Elevator System',
    difficulty: 'HARD',
    shortDesc: 'Design an elevator control system handling multiple cars, floors, and dispatch scheduling.',
    longDesc: 'Design a control system for multiple elevators in a multi-story building. The system should manage requests from inside and outside the elevators, optimize the movement of elevator cars, and handle edge cases like weight limits and emergencies.',
    time: '~45 min',
    icon: '🛗',
    color: '#fed7aa', // pastel orange
    attempts: 4,
    bestScore: 9.1,
    history: [
      { id: 1, score: 6.2, date: 'Oct 2, 2026' },
      { id: 2, score: 7.8, date: 'Oct 5, 2026' },
      { id: 3, score: 8.5, date: 'Oct 8, 2026' },
      { id: 4, score: 9.1, date: 'Oct 12, 2026' }
    ]
  }
];
