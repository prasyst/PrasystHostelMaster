import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, styled, List, ListItem, ListItemText } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Overview from '../Components/Overview';
import DbAccounts from '../Components/DbAccounts';
const Dashboard = () => {

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
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
        <>
          <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <StyledTabs value={value} onChange={handleChange}>
          <StyledTab label="Overview" />
          <StyledTab label="Account" />
          <StyledTab label="On Demand Service" />
          <StyledTab label="PPM " />
          <StyledTab label="Re-Growth" />
        
        </StyledTabs>
      </Box>
      <Box>
        {value === 0 && <Overview />}
        {value === 1 && <DbAccounts />}
        {value === 2 && <div>On Demand Component</div>}
        {value === 3 && <div>PPM Component</div>}
      </Box>
    </Box>
        </>

    )
}

export default Dashboard