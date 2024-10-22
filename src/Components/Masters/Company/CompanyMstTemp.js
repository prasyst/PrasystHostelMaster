import React, { useState } from 'react';
import {
  Box, Grid, Button, Typography, Stepper, Step, StepLabel
} from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import StepConnector from '@mui/material/StepConnector';
import StepperMst1 from './StepperMst1'; 
import StepperMst2 from './StepperMst2';



const steps = ['Company Details', 'Branch Details'];

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
    borderRadius: 1,
    margin: '7px 30px 20px 30px',
  },
}));

const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
  width: 40,
  height: 40,
  border: '3px solid',
  borderColor: ownerState.active ? '#7c3aed' : '#e0e0e0',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: ownerState.active ? '#7c3aed' : '#999',
  fontSize: '1.2rem',
  fontWeight: 'bold',
}));

const CustomStepLabel = styled(StepLabel)({
  flexDirection: 'column',
  '& .MuiStepLabel-labelContainer': {
    marginTop: '5px',
  },
});

const CompanyMstTemp = () => {





  const [activeStep, setActiveStep] = useState(0); 
  const [mode, setMode] = useState('view'); /// temporary 







  const handleStepClick = (step) => {
    if (mode === 'view') {
      setActiveStep(step);
    }
  };

  return (
    <Grid>
      <Box className="form-container">
        <Grid container spacing={2} className="rasidant_grid">
          {/* Header Section */}
          <Grid
            item
            xs={12}
            className="form_title"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <Grid>
              {/* Previous Button */}
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                className="three-d-button-previous"
              >
                <KeyboardArrowLeftIcon />
              </Button>
              {/* Next Button */}
              <Button
                variant="contained"
                size="small"
                className="three-d-button-next"
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <Typography variant="h5">Company Master</Typography>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              {/* Add, Edit, Delete, Cancel Buttons */}
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          {/* Stepper Section */}
          <Grid item xs={12}>
            <Stepper
              activeStep={activeStep}
              connector={<CustomStepConnector />}
              alternativeLabel
            >
              {steps.map((label, index) => (
                <Step
                  key={label}
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: mode === 'view' ? 'pointer' : 'default' }}
                >
                  <CustomStepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon
                        ownerState={{ ...props, active: activeStep === index }}
                      >
                        {index + 1}
                      </CustomStepIcon>
                    )}
                  >
                    {label}
                  </CustomStepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          {/* Content Based on Active Step */}
          <Grid item xs={12}>
            {activeStep === 0 ? (
              <StepperMst1 />
            ) : (
                <StepperMst2 />
            )}
          </Grid>

          {/* Buttons for form actions */}
          <Grid item xs={12} className="form_button">
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }}
            >
              Next
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default CompanyMstTemp;
