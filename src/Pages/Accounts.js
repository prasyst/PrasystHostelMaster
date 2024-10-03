import React, {useState,useEffect} from 'react';
import { Box, styled, List, ListItem, ListItemText } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate ,useLocation} from 'react-router-dom';
import Vouchers from '../Components/Vouchers';


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


const Accounts = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const tabs = [
      { label: "Vouchers", path: "/accounts/vouchers", component: Vouchers }
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

export default Accounts;