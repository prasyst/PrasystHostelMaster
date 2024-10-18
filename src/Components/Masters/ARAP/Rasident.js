import React, { useEffect, useState } from 'react';
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
import { Navigate, useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { ConfirmDialog } from '../../ReusablePopup/CustomModel';

import { z } from 'zod';

const steps = ['Personal Info', 'Family Info', 'Work Info', 'Document Upload'];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
    borderRadius: 1,
    marginBottom: '20px',

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
const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  PinId: z.string().length(6, "Pin Code must be 6 digits"),
  // Add other fields as needed
});
const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mode, setMode] = useState('view');
  const [sourceBy, setSourceBy] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [course, setCourse] = useState([]);
  const [semester, setSemester] = useState([]);
  const [billingCorporate, setBillingCorporate] = useState([]);
  const [source, setSource] = useState([])
  const [relation, setRelation] = useState([])
  const location = useLocation();
  const [currentResidentId, setCurrentResidentId] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState(null);
  const [areaOptions, setAreaOptions] = useState([]);


  useEffect(() => {
    console.log('111',location?.state?.residentId)
    if (location.state && location.state?.residentId) {
      setCurrentResidentId(location.state.Id);
      fetchResidentData(location.state?.residentId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchResidentData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}ResidentMst/RetriveResidentMst`, {
        residentId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const residentData = response.data.data[0];
        console.log('residentData',residentData)
        setFormData({
          firstName: residentData.firstName || '',
          MidName: residentData.midName || '',
          lastName: residentData.lastName || '',
          gender: residentData.gender || '',
          Dob: residentData.dob ? new Date(residentData.dob).toISOString().split('T')[0] : '', // Format date as YYYY-MM-DD
          mobileNo: residentData.mobile || '',
          emailId: residentData.email || '',
          aadharCard: residentData.aadharNo || '',
          panCard: residentData.panNo || '',
          PinId: residentData.pinId ? residentData.pinId.toString() : '',
          PermanentAddr: residentData.permanentAddr || '',
          CurrentAddr: residentData.currentAddr || '',
          photo: residentData.photo || '',
          altMobile: residentData.altMob || '',
          EmgMob: residentData.emgMob || '',
          RelationTitle: residentData.relationTitle || '',
          Relation_Name: residentData.relation_Name || '',
          relation: residentData.relation || '',
          TotalSibling: residentData.totalSibling ? residentData.totalSibling.toString() : '',
          BillToPartyId: residentData.billToPartyId ? residentData.billToPartyId.toString() : '',
          institutions: residentData.instituteID ? residentData.instituteID.toString() : '',
          course: residentData.courseId ? residentData.courseId.toString() : '',
          jobTitle: residentData.jobTitle ? residentData.jobTitle.toString() : '',
          lastHostle: residentData.lastHostle || '',
          workEmail: residentData.workEmail || '',
          workPhoneNo: residentData.workPhone || '',
          semester: residentData.semesterId || '',
          Status: residentData.status || '1',
          remark: residentData.remark || '',
          CreatedBy: residentData.createdBy ? residentData.createdBy.toString() : '1'
        });
        setIsFormDisabled(true);
      setCurrentResidentId(residentData?.residentId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch rasident data');
      }
    } catch (error) {
      console.error('Error fetching rasident data:', error);
      toast.error('Error fetching rasident data. Please try again.');
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    MidName: '',
    lastName: '',
    gender: '',
    Dob: '',
    mobileNo: '',
    emailId: '',
    AadharNo: '',
    panNo: '',
    PinId: '',
    PermanentAddr: '',
    CurrentAddr: '',
    photo: '',
    altMobile: '',
    EmgMob: '',
    RelationTitle: '',
    Relation_Name: '',
    relation: '',
    TotalSibling: '',
    BillToPartyId: '',
    institutions: '',
    course: '',
    jobTitle: '',
    lastHostle: '',
    workEmail: '',
    workPhoneNo: '',
    semester: '',
    Status: '1',
    remark: '',
    CreatedBy: '1'
  });
 const getJobTitle=async()=>{
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}MstDesi/getMstDesidrp`)
    if (response.data && response.data.data) {
      setJobTitle(response.data.data)
    }
  } catch (err) {
    console.error('Error fetching courses:', err);
  }
 }
  const GetSourceName = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstSource/getMstSourcedrp`)
      if (response.data && response.data.data) {
        setSource(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  }
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}ResidentMst/getRelativedrp`)
        if (response.data && response.data.data) {
          setRelation(response.data.data)
        }
      } catch (error) {
        toast.error('Something went wrong')
      }
    }
    fetchData()
  },[])
  
  const GetCourceName = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstCourse/getMstCoursedrp`);
      if (response.data && response.data.data) {
        setCourse(response.data.data);
      }
    } catch (err) {
      toast.error('Error fetching courses:', err);
    }
  }

  const GetInstituteeName = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}MstInstitute/getMstInstitutedrp`)
      if (res.data && res.data.data) {

        setInstitutions(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  }
const getPartyBill=async()=>{
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}PartyMst/getPartyMstdrp`)
    console.log('2', res.data.data)
    if (res.data && res.data.data) {
   console.log('22',res.data)
      setBillingCorporate(res.data.data)
    }
  } catch (err) {
    console.error('Error fetching courses:', err);
  }
}
  const GetSemesterName = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}MstSemester/getMstSemesterdrp`)
      console.log('2', res.data.data)
      if (res.data && res.data.data) {

        setSemester(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  }



  useEffect(() => {
    GetSourceName()
    GetSemesterName()
    GetInstituteeName()
    GetCourceName()
    getJobTitle()
  }, [])
  const navigate = useNavigate()
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('2', event.target.value)
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      // gender: event.target.value,

    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: undefined
    }));
  };
  const validateStep = (step) => {
    let stepValid = true;
    let newErrors = {};

    if (step === 0) {
      try {
        formSchema.parse(formData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            newErrors[err.path[0]] = err.message;
          });
          stepValid = false;
        }
      }
    }

    setErrors(newErrors);
    return stepValid;
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      // billingType: event.target.value
    }));
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      profession: event.target.value
    }));
    console.log('55', setFormData(prevData => ({
      ...prevData,
      [name]: value,
      profession: event.target.value
    })))
  };

  const handleNextdata=async()=>{
    if (currentResidentId) {
      await fetchResidentData(currentResidentId, "N");
    }
  }

  const handleBackdata=async()=>{
    if (currentResidentId && currentResidentId > 1) {
      await fetchResidentData(currentResidentId, "P");
    }
  }

  // const handleNext = () => {
  //   if (validateStep(activeStep)) {
  //     if (activeStep === steps.length - 1) {
  //       handleSubmit();
  //     } else {
  //       setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     }
  //   }
  // };

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

  const handleSubmit = async () => {
    const payload = {
      ResidentId: currentResidentId || 0, 
      FirstName: formData.firstName,
      MidName: formData.MidName || "",
      LastName: formData.lastName,
      Gender: formData.gender,
      Dob: formData.Dob, // Ensure this is in the correct format (e.g., "MM/DD/YYYY")
      Mobile: formData.mobileNo,
      Email: formData.emailId,
      AadharNo: formData.AadharNo || '',
      panNo: formData.panNo || '',
      PinId: parseInt(formData.PinId) || 1,
      PermanentAddr: formData.PermanentAddr || '',
      CurrentAddr: formData.CurrentAddr || '',
      photo: formData.photo || "photo",
      AltMob: formData.altMobile || '',
      EmgMob: formData.EmgMob || '',
      RelationTitle: formData.RelationTitle || '',
      Relation_Name: formData.Relation_Name || "",
      Relation: formData.relation || "",
      TotalSibling: formData.TotalSibling ? parseInt(formData.TotalSibling) : 0,
      BillToPartyId: parseInt(formData.BillToPartyId) || 1,
      InstituteID: parseInt(formData.institutions) || 1,
      CourseId: parseInt(formData.course) || 1,
      JobTitle: parseInt(formData.jobTitle) || 1,
      LastHostle: formData.lastHostle || '',
      WorkEmail: formData.workEmail || '',
      WorkPhone: formData.workPhoneNo || '',
      SemesterId: parseInt(formData.semester) || 1,
      Status: formData.Status || '1',
      Remark: formData.remark || '',
      CreatedBy: "1",
      UpdatedBy: "1" // Include this for update operations
    };
  
    console.log('Payload:', payload);
  
    try {
      const endpoint = currentResidentId 
        ? `${process.env.REACT_APP_API_URL}ResidentMst/UpdateResidentMst`
        : `${process.env.REACT_APP_API_URL}ResidentMst/InsertResidentMst`;
  
      const response = await axios.post(endpoint, payload);
  
      if (response.data.status === 0) {
        toast.success(response.data.message);
        setIsEditing(false);
        setIsFormDisabled(true);
        if (!currentResidentId) {
          setCurrentResidentId(response.data.data.ResidentId); // Assuming the API returns the new ID
        }
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

 


  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
    setCurrentResidentId(null);
    setFormData({
      firstName: '',
      MidName: '',
      lastName: '',
      gender: '',
      Dob: '',
      mobileNo: '',
      emailId: '',
      AadharNo: '',
      panNo: '',
      PinId: '',
      PermanentAddr: '',
      CurrentAddr: '',
      photo: '',
      altMobile: '',
      EmgMob: '',
      RelationTitle: '',
      Relation_Name: '',
      relation: '',
      TotalSibling: '',
      BillToPartyId: '',
      institutions: '',
      course: '',
      jobTitle: '',
      lastHostle: '',
      workEmail: '',
      workPhoneNo: '',
      semester: '',
      Status: '1',
      remark: '',
      CreatedBy: '1'
    });

    setActiveStep(0);
    setErrors({});
    setPhoto('');

    toast.info("Form cleared for new entry");
  };

  const handleEdit = () => {
    setMode('edit')
    setIsFormDisabled(false);
  };

  const handleSave = () => {
    // Implement save logic
    setMode('view');
  };

 
    const handleCancel = async () => {
      if (mode === 'add') {
        try {
          await fetchResidentData(1, "L");
          setMode('view');
          setIsFormDisabled(true);
        } catch (error) {
          toast.error('Error occurred while cancelling. Please try again.');
        }
      } else if (mode === 'edit') {
        if (currentResidentId) {
          await fetchResidentData(currentResidentId);
        }
        setMode('view');
        setIsFormDisabled(true);
      }
  
    };
  

  const handleDelete = () => {
    setIsConfirmDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await fetchResidentData(currentResidentId, "D");
      // toast.success('Data deleted successfully');
      await fetchResidentData(currentResidentId, "N");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error deleting company. Please try again.');
    }
    setIsConfirmDialogOpen(false);
  };

  const handleExit = () => {
    navigate('/masters/residenttable')
  };

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Use a Promise to handle the file reading
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result); // This will be the Base64 string
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Read the file and update the state
      readFileAsBase64(file)
        .then(base64String => {
          setFormData(prevData => ({
            ...prevData,
            photo: base64String
          }));
        })
        .catch(err => {
          console.error('Error reading file:', err);
          toast.error('Error reading file. Please try again.');
        });
    }
  };

  const handleAreaChange = async (e) => {
    const selectedArea = e.target.value;
    setFormData(prevState => ({ ...prevState, area: selectedArea }));

    try {
      const response = await axios.post('http://43.230.196.21/api/pincodeMst/getdrppincodeAreawise_datafill', {
        PinCode: formData.PinId,
        AreaName: selectedArea
      });
      const data = response.data.data[0];
      console.log('Area data', data);
      if (data) {
        setFormData(prevState => ({
          ...prevState,
          state: data.stateName || '',
          city: data.cityName || '',
          country: data.countryName || 'India',
        }));
      }
    } catch (error) {
      console.error('Error fetching area data:', error);
    }
  };
  const handleInputChangePin = async (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'PinId' && value.length === 6) {
      try {
        const response = await axios.post('http://43.230.196.21/api/pincodeMst/getdrppincodewisearea', {
          PinCode: value,
        });
        const data = response.data.data;
        console.log('data', data);
        if (data && data.length > 0) {
          // Set area options
          setAreaOptions(data.map(item => item.name));
          
          // Set other form data (using the first item for now)
          // setFormData(prevState => ({
          //   ...prevState,
          //   city: data[0].cityId || '',
          //   state: data[0].stateId || '',
          //   country: 'India',
          // }));
        }
      } catch (error) {
        console.error('Error fetching pin code data:', error);
      }
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
                              <Grid item xs={12} md={3}>
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
                              <Grid item xs={12} md={3} className='form_field'>
                                <FormControl variant="filled" fullWidth   className="custom-textfield">
                                  <InputLabel id="source-select-label">Source</InputLabel>
                                  <Select
                                    labelId="source-select-label"
                                    id="source-select"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="custom-textfield"
                                    disabled={isFormDisabled}
                                  >
                                    {source.map((item) => (
                                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>

                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="Source Name"
                                  name="sourceName"
                                  value={formData.sourceName}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="Reffered By"
                                  name="refferedBy"
                                  value={formData.refferedBy}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                            </Grid>
                          </Box>

                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label={<>First Name <Typography component="span" color="error">*</Typography></>}
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              error={!!errors.firstName}
                              // helperText={errors.firstName}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="lastName"
                              value={formData.lastName}
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
                              label="Date of Birth"
                              name="Dob"
                              type="date"
                              value={formData.Dob}
                              onChange={handleInputChange}
                              InputLabelProps={{ shrink: true }}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Grid container alignItems="center" spacing={2} sx={{ paddingLeft: '9px' }}>
                              <Grid item>
                                <FormLabel component="legend">Gender</FormLabel>
                              </Grid>

                              <Grid item>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    aria-label="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    row
                                  >
                                    <FormControlLabel
                                      value="male"
                                      control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                      label="Male"
                                      className="custom-textfield"
                                      disabled={isFormDisabled} 
                                    />
                                    <FormControlLabel
                                      value="female"
                                      control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                      label="Female"
                                      className="custom-textfield"
                                      disabled={isFormDisabled} 
                                    />
                                    <FormControlLabel
                                      value="others"
                                      control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                      label="Others"
                                      className="custom-textfield"
                                      disabled={isFormDisabled} 
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>

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
                        {formData.photo ? (
                          <img
                            src={formData.photo}
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
                              label="Email ID"
                              name="emailId"
                              type="email"
                              value={formData.emailId}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              label="Alt Mobile"
                              name="altMobile"
                              value={formData.altMobile}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              label="Pan Card"
                              name="panCard"
                              value={formData.panCard}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Aadhar Card"
                              name="aadharCard"
                              value={formData.aadharCard }
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Pin Code"
                              name="PinId"
                              value={formData.PinId}
                              onChange={handleInputChangePin}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
        <FormControl className='custom-textfield' fullWidth variant="filled"  disabled={isFormDisabled} >
          <InputLabel>Area/Place</InputLabel>
          <Select
            value={formData.area}
            onChange={handleAreaChange}
            name="area"
            className="custom-textfield"
          >
            {areaOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChangePin}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              InputLabelProps={{ shrink: true }}

                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="State"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChangePin}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="City"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              InputLabelProps={{ shrink: true }}

                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Remark (if any) .."
                              name="remark"
                              value={formData.remark}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              label="Permanenet Address"
                              name="PermanentAddr"
                              value={formData.PermanentAddr}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
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
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              label="Correspondence Address"
                              name="CurrentAddr"
                              value={formData.CurrentAddr}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
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

                    </Grid>
                  </Grid>

                </Grid>
              );
            case 1:
              return (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <FormControl variant="filled" fullWidth   className="custom-textfield">
                      <InputLabel id="parent-select-label">Parent/Spouse</InputLabel>
                      <Select
                        labelId="parent-select-label"
                        id="parent"
                        name="parent"
                        value={formData.parent}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        className="custom-textfield"
                      >
                        {relation.map((item) => (
                          <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>

                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Spouse Name"
                      variant="filled"
                      name='RelationTitle'
                      value={formData.RelationTitle}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      className="custom-textfield"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Number of Siblings"
                      variant="filled"
                      name="TotalSibling"
                      onChange={handleInputChange}
                      value={formData.TotalSibling}
                      disabled={isFormDisabled}
                      className="custom-textfield"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      variant="filled"
                      name="EmgMob"
                      value={formData.EmgMob}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                      className="custom-textfield"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      id="relation"
                      name="relation"
                      label="Relation"
                      variant="filled"
                      fullWidth
                      className="custom-textfield"
                      value={formData.relation}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                    />
                  </Grid>
                </Grid>

              );
            case 2:
              return (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Grid container alignItems="center" spacing={2} sx={{ paddingLeft: '9px' }}>
                      <Grid item>
                        <FormLabel component="legend">Billing Type</FormLabel>
                      </Grid>

                      <Grid item>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="billing-type"
                            name="billing-type"
                            value={formData.billingType}
                            onChange={changeHandler}
                            row
                          >
                            <FormControlLabel
                              value="individual"
                              control={<Radio />}
                              label="Individual"
                              className="custom-textfield"
                              disabled={isFormDisabled}
                            />
                            <FormControlLabel
                              value="corporate"
                              control={<Radio />}
                              label="Corporate"
                              className="custom-textfield"
                              disabled={isFormDisabled}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Grid container alignItems="center" spacing={2} sx={{ paddingLeft: '9px' }}>
                      <Grid item>
                        <FormLabel component="legend">Profession</FormLabel>
                      </Grid>

                      <Grid item>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="profession"
                            name="profession"
                            value={formData.profession}
                            onChange={inputChangeHandler}
                            row
                          >
                            <FormControlLabel
                              value="student"
                              control={<Radio />}
                              label="Student"
                              className="custom-textfield"
                              disabled={isFormDisabled}
                            />
                            <FormControlLabel
                              value="service"
                              control={<Radio />}
                              label="Service"
                              className="custom-textfield"
                              disabled={isFormDisabled}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={4} className='form_field'>
                    <FormControl variant="filled" fullWidth className="custom-textfield">
                      <InputLabel id="jobTitle-select-label">Job Title</InputLabel>
                      <Select
                        labelId="jobTitle-select-label"
                        id="jobTitle-select"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="custom-textfield"
                      >
                        {jobTitle.map((item)=>(
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>

                        ))}
                    
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} className='form_field'>
                    <FormControl variant="filled" fullWidth className="custom-textfield">
                      <InputLabel id="billingCorporate-select-label">Billing Corporate</InputLabel>
                      <Select
                        labelId="billingCorporate-select-label"
                        id="billingCorporate-select"
                        name="billingCorporate"
                        value={formData.billingCorporate}
                        onChange={handleInputChange}
                        className="custom-textfield"
                        disabled={isFormDisabled}
                      >
                        <MenuItem key={billingCorporate.id} value={billingCorporate.id}>Professional</MenuItem>
                        <MenuItem key={billingCorporate.id} value={billingCorporate.id}>Individual</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} className='form_field'>
                    <FormControl variant="filled" fullWidth className="custom-textfield">
                      <InputLabel id="Institutions-select-label">Institutions</InputLabel>
                      <Select
                        labelId="Institutions-select-label"
                        id="Institutions-select"
                        name="institutions"
                        value={formData.institutions}
                        onChange={handleInputChange}
                        className="custom-textfield"
                      disabled={isFormDisabled}

                      >
                        {institutions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} className='form_field'>
                    <FormControl variant="filled" fullWidth className="custom-textfield">
                      <InputLabel id="course-select-label">Course</InputLabel>
                      <Select
                        labelId="course-select-label"
                        id="course-select"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                      >
                        {course.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} className='form_field'>
                    <FormControl variant="filled" fullWidth   className="custom-textfield">
                      <InputLabel id="semester-select-label">Semester</InputLabel>
                      <Select
                        labelId="semester-select-label"
                        id="semester-select"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                      
                      disabled={isFormDisabled}

                      >
                        {semester.map((sem) => (
                          <MenuItem key={sem.id} value={sem.id}>
                            {sem.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      id="workEmail"
                      name="workEmail"
                      label="Work Email"
                      variant="filled"
                      fullWidth
                      className="custom-textfield"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      id="workPhoneNo"
                      name="workPhoneNo"
                      label="Work PhoneNo"
                      variant="filled"
                      fullWidth
                      className="custom-textfield"
                      value={formData.workPhoneNo}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      id="lastHostle"
                      name="lastHostle"
                      label="Last Hostle"
                      variant="filled"
                      fullWidth
                      className="custom-textfield"
                      value={formData.lastHostle}
                      onChange={handleInputChange}
                      disabled={isFormDisabled}
                    />
                  </Grid>
                </Grid>
              );
            case 3:
              return (
                <Box>
                  <input type="file" style={{ width: '100%' }} disabled={isFormDisabled} />
                  <Typography>Upload your documents here</Typography>
                </Box>
              );
            default:
              return null;
          }
        })()}
      </Box>
    );
  };
  const handleStepClick = (step) => {
    if (mode === 'view' ) {
      setActiveStep(step);
    }
  };

  return (
    <Grid >
      <Box className="form-container">
      <ToastContainer />
        <Grid container spacing={2} className='rasidant_grid'>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                className='three-d-button-previous'
                onClick={handleBackdata}
                disabled={activeStep.length === 0 || mode !== 'view'}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                className='three-d-button-next'
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleNextdata}
                disabled={activeStep === steps.length - 1 || mode !== 'view'}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <Typography variant="h5">Resident Master</Typography>
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
            <Stepper activeStep={activeStep} connector={<CustomStepConnector />} >
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepClick(index)} style={{ cursor: mode === 'view'  ? 'pointer' : 'default' }}>
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
              disabled={activeStep === 0 || mode === 'view'}

            >
              {/* {activeStep === steps.length - 1 ? 'Previous' : ''} */}
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              // sx={{ mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }}
              disabled={mode === "view"}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              // sx={{ mr: 1 }}
              disabled={mode==="view"}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this data?"
        onConfirm={handleConfirmDelete}
      />
    </Grid>
  );
};

export default StepperForm;