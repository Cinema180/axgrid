import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabContextType {
  selectedTab: number;
  setSelectedTab: (tabIndex: number) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

function TabProvider({ children }: { children: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const value = React.useMemo(() => ({ selectedTab, setSelectedTab }), [selectedTab, setSelectedTab]);

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}

function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}

export { TabProvider, useTabContext };
