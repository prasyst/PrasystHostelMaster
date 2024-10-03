import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import img1 from '../assets/Images/company.jpg'
import { Link } from 'react-router-dom';
import { textAlign } from '@mui/system';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Company = () => {
  const names = ['Company Master', 'Employee', 'Designation', 'Employee Type', 'User Type', 'User Master'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/masters/companytable'>Company Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/userMasterTable'>User Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/employeetable'>Employee</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/designationtable'>Designation</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/employeetypetable'>Employee Type</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='#'>User Type</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
        
        </Grid>
      </Grid>
    </Box>
  );
}

export default Company;
