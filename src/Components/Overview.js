import { Typography } from '@mui/material'
import React from 'react'
import dashboard from '../assets/Images/dashboard.png'
import {Box} from '@mui/material'
import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Grid from '@mui/material/Unstable_Grid2';
import { PieChart } from '@mui/x-charts/PieChart';

const Overview=()=>{
      
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
    return(
        <>
       <Box>
        <img src={dashboard} alt='overview' style={{width:'100%',height:'100%'}}/>
        <Grid container spacing={2} sx={{marginTop:'15px'}}>
        <Grid xs={6} >
          <Item>
          <PieChart
  series={[
    {
      data: [
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
      ],
    },
  ]}
  width={400}
  height={200}
/>
          </Item>
        </Grid>
        <Grid xs={6}>
          <Item>
          <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
        },
        {
          data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
        },
        {
          data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
          valueFormatter: (value) => (value == null ? '?' : value.toString()),
        },
      ]}
      height={200}
      margin={{ top: 10, bottom: 20 }}
    />
          </Item>
        </Grid>
        </Grid>
       </Box>
        </>
    )
}
export default Overview