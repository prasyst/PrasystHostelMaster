import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import img1 from '../assets/Images/hostel.jpg';
import { Link } from 'react-router-dom';
import { textAlign } from '@mui/system';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Property = () => {
  const names = ['Wing', 'Floor', 'Room Type', 'Room View', 'Room Bed', 'Room Master', 
                 'Room Bed Number', 'Facilities Master', 'Room Type Facilities Link', 'Room Facility Link'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/propertytable'>Property Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/propertyTypetable'>PropertyType Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/room-master'>Room Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/roomBednumbertable'>Room Bed Number</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
          
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/wingtable'>Wing/Block Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/floortable'>Floor Master</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>  
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/roomTypetable'>Room Type Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/roomViewtable'>Room View Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/roomBedTypetable'>Room Bed Type</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/facilitiesmastertable'>Facilities Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='/roomtypefacilitieslinktable'>Room Type Facility Link</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                   <Link to='/amenitytable'>Amenities Master</Link>
                </Box>
              </Item>
            </Grid>
            {/* <Grid item xs={2}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                
                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                   <Link to='/grouptable'>Group Master</Link>
                </Box>
              </Item>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Property;
