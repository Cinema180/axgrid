
# AxGrid Energy Trading Platform

AxGrid is a dynamic energy trading platform designed for real-time management of energy sources, allowing users to create, view, and manage trades for various types of energy. The platform offers real-time updates and ensures a flexible and modular architecture for handling energy trade operations.

## Features
- Dynamic form creation based on energy source selection.
- Real-time trade updates.
- Trade management interface with a professional design.
- Modular and reusable code structure.

## Prerequisites

- **Node.js**: Version 22.8.0 or higher is recommended. However, the project should be compatible with **Node.js 18.x or newer**.
- **npm**: Version 10.8.3 is recommended, but **npm 8.x or newer** will work as well.
  
To verify that you have these installed, run the following commands in your terminal:

```bash
node -v
npm -v
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Cinema180/axgrid.git
   ```

2. Navigate to the project directory:
   ```bash
   cd axgrid
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be accessible at `http://localhost:3000` in your browser.

## Running Tests

To run the tests included for this project, use the following command:

```bash
npm test
```

## Design and Architecture

The design choices behind AxGrid are focused on clean structure and modularity, aiming for scalability. A more detailed architectural explanation can be found in the `DESIGN_DECISIONS.md` file included in the repository.

## Technologies Used
- **React** with TypeScript for the front-end.
- **Material UI (MUI)** for styling.
- **Context API and RxJS** for managing state and real-time updates.
- **Jest** and **React Testing Library** for unit testing.
