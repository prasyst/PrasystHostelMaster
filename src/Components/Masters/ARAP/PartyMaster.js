import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import StepConnector from "@mui/material/StepConnector";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText'; 
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../../Auth";
import PartyStepper1 from "./PartyStepper1";
import PartyStepper2 from "./PartyStepper2";


const steps = ['Vendor Details', 'Branch Details'];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
    borderRadius: 1,
    margin: '7px 30px 20px 30px'
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

const PartyMaster = () => { 
    const location = useLocation();
    console.log(location);
    
    const [activeStep, setActiveStep] = useState(0);
    const [mode, setMode] = useState('');



   useEffect(()=>{
       const fetch = async()=>{
        let allPartyData = await axios.post(
          `${process.env.REACT_APP_API_URL}PartyMst/RetrivePartyMstAll`,
          {
            PartyId:location.state.partyId,
            Flag:"R"
          },
          AuthHeader() 
        ); 

        console.log("allPartyData",allPartyData);
       }


     fetch(); 
   })

    const handleStepClick = (step) => {
          setActiveStep(step);
    };

  return (
    <Grid>
    <Box className="form-container"> 
    {/* <ToastContainer /> */}
    {/* <Dialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: '#635BFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: 'white'
              }
            }}
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
          <Button
            sx={{
              backgroundColor: '#635BFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: 'white'
              }
            }}
            onClick={handleCancel}
          >
            No
          </Button>
        </DialogActions>
      </Dialog> */}
      <Grid container spacing={2} className="rasidant_grid">
        {/* Header Section */}
        <Grid
          item
          xs={12}
          className="form_title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: activeStep == 0 && "space-between",
            gap: activeStep === 1 && "25vw",
            marginTop: "20px",
          }}
        >
          {activeStep != 1 &&  (
              <Grid>
              {/* Previous Button */}
              
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#635BFF" }}
                className="three-d-button-previous"
              >
                <KeyboardArrowLeftIcon />
              </Button>
              {/* Next Button */}
              <Button
                variant="contained"
                size="small"
                className="three-d-button-next"
                sx={{ backgroundColor: "#635BFF", margin: "0px 10px" }}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
          ) }
        
          <Typography variant="h5" sx={{margin : "Auto" }}>
            Party Master
          </Typography>
          {activeStep != 1 && (
            <Grid sx={{ display: "flex", justifyContent: "end" }}>
              {/* Add, Edit, Delete, Cancel Buttons */}
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed" }}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed" }}

              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          )}
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
                style={{ cursor: mode === "view" ? "pointer" : "default" }}
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
            <PartyStepper1/>
          ) : (
            <PartyStepper2/>
          )}
        </Grid>

        {/* Buttons for form actions */}
      </Grid>
    </Box>
  </Grid>
  )
}

export default PartyMaster
