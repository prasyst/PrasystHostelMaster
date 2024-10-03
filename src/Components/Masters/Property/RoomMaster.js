import React, { useState } from 'react';
import {
  Box, Grid, Button, TextField, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon
} from '@mui/icons-material';
import '../../../index.css'
import { FormLabel, RadioGroup, FormControlLabel, Radio, StepConnector } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';

const steps = ['Property Details', 'Annexures'];
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
const RoomMaster = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState('view');
  const [currentId, setCurrentId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    coName: '',
    branch: '',
    propertyName: '',
    sqftArea: '',
    roomNo: '',
    wing: '',
    floor: '',
    view: '',
    nfBeds: ''
  });
  const navigate=useNavigate()
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      
    }));
  };

 
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };
  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleAdd = () => {
    setMode('add');
  };

  const handleEdit = () => {
    setMode('edit');
  };

  const handleSave = () => {
    // Implement save logic
    setMode('view');
  };

  const handleCancel = () => {
    setMode('view');
  };

  const handleDelete = () => {
  };

  const handleExit = () => {
    navigate('/masters/property')
  };

  const isFormDisabled = mode === 'view';

  const [selectedImage, setSelectedImage] = useState(null);

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const renderStepContent = (step) => {
    return (
      <Box sx={{ height: '350px', overflowY: 'scroll', padding: '16px' }}>
        {(() => {
          switch (step) {
            case 0:
              return (
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                      <Grid item lg={12} md={12} xs={12}>
                      {/* <Grid container spacing={3}> */}
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} className='form_field'>
                           <FormControl variant="filled" fullWidth className="custom-select">
                            <InputLabel id="coName-select-label">Company Name</InputLabel>
                             <Select
                               labelId="coName-select-label"
                               id="coName-select"
                               name="coName"
                               value={formData.coName}
                               onChange={handleInputChange}
                               className="custom-textfield"
                             >
                            <MenuItem key={''} value={''}></MenuItem>
                            </Select>
                           </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} className='form_field'>
                           <FormControl variant="filled" fullWidth className="custom-select">
                            <InputLabel id="branch-select-label">Branch</InputLabel>
                             <Select
                               labelId="branch-select-label"
                               id="branch-select"
                               name="branch"
                               value={formData.branch}
                               onChange={handleInputChange}
                               className="custom-textfield"
                             >
                            <MenuItem key={''} value={''}></MenuItem>
                            </Select>
                           </FormControl>
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} className='form_field'>
                           <FormControl variant="filled" fullWidth className="custom-select">
                            <InputLabel id="property-select-label">Property Name</InputLabel>
                             <Select
                               labelId="property-select-label"
                               id="property-select"
                               name="property"
                               value={formData.property}
                               onChange={handleInputChange}
                               className="custom-textfield"
                             >
                            <MenuItem key={''} value={''}></MenuItem>
                            </Select>
                           </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Sq.Ft Area"
                              name="sqftArea"
                              value={formData.sqftArea}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>

                        {/* Last Name and Gender */}
                        <Grid container spacing={2}>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Room No"
                              name="roomNo"
                              value={formData.roomNo}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6} className='form_field'>
                           <FormControl variant="filled" fullWidth className="custom-select">
                            <InputLabel id="wing-select-label">Wing</InputLabel>
                             <Select
                               labelId="wing-select-label"
                               id="wing-select"
                               name="wing"
                               value={formData.wing}
                               onChange={handleInputChange}
                               className="custom-textfield"
                             >
                            <MenuItem key={''} value={''}></MenuItem>
                            </Select>
                           </FormControl>
                          </Grid>
                          
                      </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12} display="flex" alignItems="center" justifyContent="center">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        border="1px solid #ccc"
                        borderRadius={1}
                        width={130}
                        height={150}
                        overflow="hidden"
                        position="relative"
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Uploaded Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ textAlign: 'center' }}
                          >
                            Image Preview
                          </Typography>
                        )}
                      </Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-photo"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="upload-photo">
                        <Button
                          // variant="contained"
                          component="span"
                          style={{ marginTop: '5px' }}
                        >
                          Upload Image
                        </Button>
                      </label>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {/* Date of Birth and Mobile No */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Floor"
                              name="floor"
                              value={formData.floor}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="View"
                              name="view"
                              value={formData.view}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="No Of Beds"
                              name="nfBed"
                              value={formData.nfBeds}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                        </Box>
                       </Grid> 
                    {/* <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                         
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Email ID"
                              name="emailID"
                              value={formData.emailID}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Tel No"
                              name="telNo"
                              value={formData.telNo}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Mobile No"
                              name="mobileNo"
                              value={formData.mobileNo}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid> */}

                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                      {/* <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="No Of Rooms"
                              name="nfRooms"
                              value={formData.nfRooms}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="No Of Beds"
                              name="nfBeds"
                              value={formData.nfBeds}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid> */}
                    
                        {/* <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="HOD"
                              name="hod"
                              value={formData.hod}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Warden"
                              name="warden"
                              value={formData.warden}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid> */}

                      </Box>
                    </Grid>
                    
                    {/* <Grid item display="flex" alignItems="center" justifyContent="center">

                      <Box>
                        <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={12}>
                        <TextField
                         fullWidth
                         label="Address"
                         name="address"
                         value={formData.address}
                         onChange={handleInputChange}
                         multiline
                         rows={2}
                         variant="filled"
                         disabled={isFormDisabled}
                         className="custom-textfield"
                        sx={{
                         '& .MuiInputBase-root': {
                         height: '100px',
                         width: '340px'
                        },
                        '& .MuiInputBase-input': {
                        resize: 'vertical',
                        },
                       '& .MuiFilledInput-root': {
                       '&:hover': {
                       backgroundColor: 'transparent',
                       },
                       '&.Mui-focused': {
                       backgroundColor: 'transparent',
                       },
                      },
                    }}
                  />
                </Grid>
   
              </Grid>
            </Box>
            
                </Grid> */}
                  </Grid>

                </Grid>
              );
            case 1:
              return (
                 ''

              );
            default:
              return null;
          }
        })()}
      </Box>
    );
  };
  const handleStepClick = (step) => {
    if (mode === 'view' || 'add') {
      setActiveStep(step);
    }
  };

  return (
    <Grid >
      <Box className="form-container">
        <Grid container spacing={2} className='rasidant_grid'>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                  className='three-d-button-previous'
                onClick={handleBack}
                disabled={activeStep === 0 || mode !== 'view'}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                   className='three-d-button-next'
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleNext}
                disabled={activeStep === steps.length - 1 || mode !== 'view'}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <Typography variant="h5">Room Master</Typography>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view'}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view'}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDelete}
                disabled={mode !== 'view'}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view'}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Stepper activeStep={activeStep} connector={<CustomStepConnector />} alternativeLabel>
            {steps.map((label, index) => (
                <Step key={label}  style={{ cursor: mode === 'view' || 'add' ? 'pointer' : 'default' }}>
                  <CustomStepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon ownerState={{ ...props, active: activeStep === index }}>
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

          <Grid item xs={12}>
            {renderStepContent(activeStep)}
          </Grid>

          <Grid item xs={12} className="form_button">
            <Button
              variant="contained"
              size="small"
              // sx={{ backgroundColor: '#7c3aed', mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
              onClick={handleBack}
              disabled={activeStep === 0 || mode !== 'view'}

            >
              {/* {activeStep === steps.length - 1 ? 'Previous' : ''} */}
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              // sx={{ mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              // sx={{ mr: 1 }}
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

export default RoomMaster;