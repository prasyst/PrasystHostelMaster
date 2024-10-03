import React ,{useState,useEffect} from 'react'
import { Box, styled } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useNavigate, useLocation } from 'react-router-dom';
import Housekeeping from '../Components/Housekeeping';
import HR from '../Components/HR';
import Maintenance from '../Components/Maintenance';
import Transport from '../Components/Transport';


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

const Operations = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "House Keeping", path: "/operations/housekeepin", component: Housekeeping },
    { label: "Maintenance & PPM", path: "/operations/maintenance", component: Maintenance },
    { label: "Transport & Tiffin", path: "/operations/transport", component: Transport },

    { label: "H.R.", path: "/operations/hr", component: HR },
  
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
  )
}

export default Operations