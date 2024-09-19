import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Typography, Box, Avatar } from '@mui/material';
import TradeForm from './TradeForm';
import TradeTable from './TradeTable';
import TabPanel from './TabPanel';
import logo from '../resources/axgrid_logo_transparent_small.png';

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
      <Box display="flex" alignItems="center">
        <Avatar
          alt="Platform Logo"
          src={logo}
          sx={{ width: 256, height: 67, borderRadius: 2 }}
        />
      </Box>
      <Typography variant="h5" gutterBottom>
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
