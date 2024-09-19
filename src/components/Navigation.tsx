import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Typography } from '@mui/material';
import TradeForm from './TradeForm';
import TradeTable from './TradeTable';
import TabPanel from './TabPanel';

function Navigation() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/form');
    } else {
      navigate('/table');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Energy Trading Platform
      </Typography>

      {/* Material UI Tabs for Navigation */}
      <Tabs value={value} onChange={handleTabChange} aria-label="Trade Tabs">
        <Tab label="Trade Form" />
        <Tab label="Trade Table" />
      </Tabs>

      {/* TabPanels for showing active content */}
      <TabPanel value={value} index={0}>
        <TradeForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TradeTable />
      </TabPanel>
    </div>
  );
}

export default Navigation;
