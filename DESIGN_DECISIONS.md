
# AxGrid Design Decisions

## Overview

AxGrid is designed as a modular and scalable energy trading platform, with a clean front-end architecture. The architecture ensures flexibility in adding new energy sources and dynamic form management for creating and viewing trades.

## Key Design Decisions

### Frontend

- **React**: Used for the component-based structure and dynamic UI updates. The components are modular and reusable, following best practices for separation of concerns.
- **MUI (Material-UI)**: Employed for the user interface design, ensuring a professional and responsive look, as well as built-in accessibility and theme support.
- **Context API and RxJS**: For managing state and handling real-time updates in trade data. This combination allows for flexibility in how trades are managed and updated.
- **React Router**: Used for page navigation, ensuring seamless routing between components such as 'TradeManager' and 'TradeForm'.

### Trade Management

- **TradeContext**: A custom context providing trade data throughout the app, ensuring that trade updates are available globally across components.
- **Dynamic Forms**: The 'TradeForm' component dynamically generates fields based on energy source configuration, allowing for flexibility in supporting multiple energy types without hardcoding.

### Folder Structure
.
├── public                      # Static assets
├── src                         # Source code
│   ├── App                     # Main App component, tests, and helpers 
│   ├── components              # React components
│   │   ├── TradeDetailDialog   # TradeDetailDialog component and helpers
│   │   ├── TradeForm           # TradeForm component, tests, and helpers
│   │   └── TradeManager        # TradeManager component, tests, and helpers
│   ├── resources               # formConfig.json and AxGrid logo
│   ├── services                # Mocked service layer (RxJS and trade management)
│   ├── store                   # Context and state management
│   ├── types                   # TypeScript types                
│   ├── index.tsx               # Entry point for React
├── README.md                   # Project documentation
├── DESIGN_DECISIONS.md         # Architectural documentation
└── package.json                # Node.js dependencies and scripts

## Key Components

1. **App.tsx**: The main entry point of the application, handling routing and context providers.
2. **TradeManager**: Displays a table of trades and allows users to view trade details and confirm trades.
3. **TradeForm**: A form allowing users to create new trades based on the selected energy source.
4. **TradeDetailDialog**: A dialog displaying an individual trade's details to the user.

## Future Considerations

In the future, additional energy sources can be added to the platform with minimal changes, thanks to the dynamic form structure. Integration with real back-end services can also be implemented to enhance the trade management experience.
