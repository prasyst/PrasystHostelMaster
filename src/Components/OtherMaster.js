import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import img1 from '../assets/Images/account.jpg';
import { Link } from 'react-router-dom';
import { textAlign } from '@mui/system';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const OtherMaster = () => {
  const names = ['Food & Beverages', 'Amenities Master', 'Events Master', 'Enquiry Source', 
                 'Digital Media Type', 'Media Name Master'];

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
                  <Link to='#'>Food & Beverages</Link>
                </Box>
              </Item>
            </Grid>
            {/* <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='#'>Amenities Master</Link>
                </Box>
              </Item>
            </Grid> */}
            <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='#'>Events Master</Link>
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
                  <Link to='#'>Enquiry Source</Link>
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
                  <Link to='#'>Digital Media Type</Link>
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
                  <Link to='#'>Media Name Master</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>  
         
            {/* <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <a href=''>Pincode</a>
                </Box>
              </Item>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OtherMaster;