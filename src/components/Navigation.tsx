import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Typography, Box, Avatar } from '@mui/material';
import logo from '../resources/axgrid_logo_transparent_small.png';
import { useTabContext } from '../store/TabContext';

function Navigation() {
  const { selectedTab, setSelectedTab } = useTabContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the tab index based on the current URL
  useEffect(() => {
    if (location.pathname === '/new-trade') {
      setSelectedTab(1);
    } else {
      setSelectedTab(0); // Default to Trade Manager if path is /trade-manager or root
    }
  }, [location.pathname, setSelectedTab]);

  const handleTabChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setSelectedTab(newValue);
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
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="Trade Tabs"
      >
        <Tab label="Trade Manager" />
        <Tab label="New Trade" />
      </Tabs>
    </Box>
  );
}

export default Navigation;
