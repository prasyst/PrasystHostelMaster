import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import img1 from '../../assets/Images/hostel.jpg';
import { Link } from 'react-router-dom';
import { textAlign } from '@mui/system';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const PreRegistration=()=>{
    return(
        <>
           <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <img
                  src={img1}
                  alt='Registration'
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <a href=''>Enquiry</a>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <img
                  src={img1}
                  alt='KYC'
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to=''>Follow-ups</Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <img
                  src={img1}
                  alt='KYC'
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to=''>Pre-Registration</Link>
                </Box>
              </Box>
            </Grid>
       
          </Grid>
        </Grid>
      </Grid>
    </Box>
        </>
    )
}
export default PreRegistration