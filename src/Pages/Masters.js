import React, {useState,useEffect} from 'react';
import { Box, styled, List, ListItem, ListItemText } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate ,useLocation} from 'react-router-dom';
import Location from '../Components/Location';
import Company from '../Components/Company';
import ARAP from '../Components/ARAP';
import Property from '../Components/Property';
import Operations from '../Components/Operations.js';
import Account from '../Components/Account';
import Inventory from '../Components/Inventory';
import Ticketing from '../Components/Ticketing';
import OtherMaster from '../Components/OtherMaster';
import ControlSecurity from '../Components/ControlSecurity';


const StyledTabs = styled(Tabs)({
  backgroundColor: '#f0f0f0',
  borderRadius: '10px',
  padding: '4px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  minHeight: '36px',
  padding: '8px 16px',
  borderRadius: '5px',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: '#7c3aed',
  },
}));


const Masters = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const tabs = [
      { label: "Company", path: "/masters/company", component: Company },
      { label: "Property", path: "/masters/property", component: Property },
      { label: "AR/AP", path: "/masters/arap", component: ARAP },
      { label: "Location", path: "/masters/location", component: Location },
      { label: "Accounts", path: "/masters/accounts", component: Account },
      { label: "Ticketing", path: "/masters/ticketing", component: Ticketing },
      { label: "Operations", path: "/masters/operations", component: Operations },
      { label: "Inventory", path: "/masters/inventory", component: Inventory },
      { label: "Other Master", path: "/masters/other-master", component: OtherMaster },
      { label: "Control & Security", path: "/masters/control-security", component: ControlSecurity}
    ];
  
    const [activeTab, setActiveTab] = useState(0);
  
    useEffect(() => {
      const currentTabIndex = tabs.findIndex(tab => tab.path === location.pathname);
      if (currentTabIndex !== -1) {
        setActiveTab(currentTabIndex);
      }
    }, [location.pathname]);
  
    const handleChange = (event, newValue) => {
      setActiveTab(newValue);
      navigate(tabs[newValue].path);
    };
  
    const ActiveComponent = tabs[activeTab].component;
  return (
    <Box sx={{ width: '100%', p: 2 }}>
    <Box sx={{ mb: 4 }}>
      <StyledTabs value={activeTab} onChange={handleChange}>
        {tabs.map((tab, index) => (
          <StyledTab key={index} label={tab.label} />
        ))}
      </StyledTabs>
    </Box>
    <Box>
      <ActiveComponent />
    </Box>
  </Box>
  );
};

export default Masters;