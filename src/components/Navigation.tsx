import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Typography, Box, Avatar } from '@mui/material';
import logo from '../resources/axgrid_logo_transparent_small.png';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the tab index based on the current URL
  const getTabIndex = () => {
    if (location.pathname === '/new-trade') return 1;
    return 0; // Default to Trade Manager if path is /trade-manager or root
  };

  const [value, setValue] = useState(getTabIndex());

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/trade-manager');
    } else {
      navigate('/new-trade');
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Avatar
          alt="AxGrid Logo"
          src={logo}
          sx={{ width: 256, height: 67, borderRadius: 2 }}
        />
      </Box>
      <Typography variant="h5" gutterBottom>
        Energy Trading Platform
      </Typography>
      <Tabs value={value} onChange={handleTabChange} aria-label="Trade Tabs">
        <Tab label="Trade Manager" />
        <Tab label="New Trade" />
      </Tabs>
    </Box>
  );
}

export default Navigation;
