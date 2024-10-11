import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Button, TextField, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Autocomplete, Checkbox
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon
} from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import '../../../index.css'
import { FormLabel, RadioGroup, FormControlLabel, Radio, StepConnector } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { ConfirmDialog } from '../../ReusablePopup/CustomModel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { z } from 'zod';

const steps = ['Property Details', 'Floor Configuration', 'Amenity Configuration'];
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

   const rows = [
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' },
    { col1: '', col2: '', col3: '', col4: '' }
   ];

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mode, setMode] = useState('view');
  // const [sourceBy, setSourceBy] = useState([]);
  // const [jobTitle, setJobTitle] = useState([]);
  // const [institutions, setInstitutions] = useState([]);
  // const [course, setCourse] = useState([]);
  // const [semester, setSemester] = useState([]);
  // const [billingCorporate, setBillingCorporate] = useState([]);
  // const [source, setSource] = useState([])
  // const [relation, setRelation] = useState([])
  const [currentPropId, setCurrentPropId] = useState(null);
  const [hods, setHods] = useState([]);
  const [sites, setSites] = useState([]);
  const [propImg, setPropImg] = useState('');
  const [file, setFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [area, setArea] = useState([]);
  const [branch, setBranch] = useState([]);
  const [propType, setPropType] = useState([]);
  const [wings, setWings] = useState([]);
  const location = useLocation();
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // const [photo, setPhoto] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    console.log('111',location?.state?.propId)
    if (location.state && location.state?.propId) {
      setCurrentPropId(location.state.Id);
      fetchPropertyData(location.state?.propId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchPropertyData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}PropertyMst/RetrivePropertyMst`, {
        propId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const propertyData = response.data.data[0];
        console.log('propertyData',propertyData)
        setFormData({
          companyName: propertyData.companyName,
          branchName: propertyData.cobrMstId.toString(),
          propName: propertyData.propName,
          sqFt: propertyData.sqFt,
          pinCode: propertyData.pinId.toString(),
          areaName: propertyData.areaName,
          cityName: propertyData.cityId.toString(),
          propEmail: propertyData.propEmail,
          propTel: propertyData.propTel,
          propTypName: propertyData.propTypeId.toString(),
          propMob: propertyData.propMob,
          totalRooms: propertyData.totalRooms,
          totalBeds: propertyData.totalBeds,
          propImg: propertyData.propImg,
          hodEmpName: propertyData.hodEmpId.toString(),
          wardenEmpName: propertyData.wardenEmpId.toString(),
          propAdd: propertyData.propAdd,
          propGPSLoc: propertyData.propGPSLoc,
          Status: propertyData.status || '1',
          remark: propertyData.remark || '',
          CreatedBy: propertyData.createdBy ? propertyData.createdBy.toString() : '1'
        });
        setIsFormDisabled(true);
      setCurrentPropId(propertyData?.propId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch property data');
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      toast.error('Error fetching property data. Please try again.');
    }
  };

  const [formData, setFormData] = useState({
    companyName: '',
    branchName: '',
    propName: '',
    sqFt: '',
    pinCode: '',
    areaName: '',
    cityName: '',
    stateName: '',
    countryName: '',
    propEmail: '',
    propTel: '',
    propTypName: '',
    propMob: '',
    totalRooms: '',
    totalBeds: '',
    propImg: '',
    hodEmpName: '',
    wardenEmpName: '',
    propAdd: '',
    propGPSLoc: '',
    Status: '1',
    remark: '',
    CreatedBy: '1'
  });

  useEffect(() => {
    const fetchPropType = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}PropTypeMst/getMstPropTypedrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setPropType(response.data.data);
        } else {
          toast.error('Failed to fetch PropType');
        }
      } catch (error) {
        console.error('Error fetching PropType:', error);
        toast.error('Error fetching PropType. Please try again.');
      }
    };

    fetchPropType();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}CoMst/getCoMstdrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setCompanies(response.data.data);
        } else {
          toast.error('Failed to fetch CompanyName');
        }
      } catch (error) {
        console.error('Error fetching CompanyName:', error);
        toast.error('Error fetching CompanyName. Please try again.');
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchBranch = async (id) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}CoMst/getCoMstWiseCobrdrp`, {
          CoMstId: (id)
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setBranch(response.data.data);
        } else {
          toast.error('Failed to fetch Branch');
        }
      } catch (error) {
        console.error('Error fetching Branch:', error);
        toast.error('Error fetching Branch. Please try again.');
      }
    };

    if (formData.companyName) {
      fetchBranch(formData.companyName);
    }

  }, [formData.companyName]);

  useEffect(() => {
    const fetchArea = async (pinCode) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}pincodeMst/getdrppincodewisearea`, {
          pinCode: parseInt(pinCode)
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setArea(response.data.data);
        } else {
          toast.error('Failed to fetch Area');
        }
      } catch (error) {
        console.error('Error fetching Area:', error);
        toast.error('Error fetching Area. Please try again.');
      }
    };

    if (formData.pinCode) {
      fetchArea(formData.pinCode);
    }

  }, [formData.pinCode]);

  useEffect(() => {
    const fetchPlaces = async (pinCode, areaName) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}pincodeMst/getdrppincodeAreawise_datafill`, {
          pinCode: parseInt(pinCode),
          areaName: areaName
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setSites(response.data.data);
          const { cityName, stateName, countryName } = response.data.data[0];
          setFormData((prevData) => ({
            ...prevData,
            cityName,
            stateName,
            countryName,
          }));
        } else {
          toast.error('Failed to fetch PincodeArea');
        }
      } catch (error) {
        console.error('Error fetching PincodeArea:', error);
        toast.error('Error fetching PincodeArea. Please try again.');
      }
    };

    if (formData.pinCode && formData.areaName) {
      fetchPlaces(formData.pinCode, formData.areaName);
    }

  }, [formData.pinCode, formData.areaName]);

  useEffect(() => {
    const fetchHods = async (flag) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmp/getMstEmpdrp`, {
          Flag: parseInt(1)
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setHods(response.data.data);
        } else {
          toast.error('Failed to fetch Hods');
        }
      } catch (error) {
        console.error('Error fetching Hods:', error);
        toast.error('Error fetching Hods. Please try again.');
      }
    };

    fetchHods();
  }, []);

  useEffect(() => {
    const fetchWardens = async (flag) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmp/getMstEmpdrp`, {
          Flag: parseInt(2)
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setWardens(response.data.data);
        } else {
          toast.error('Failed to fetch Wardens');
        }
      } catch (error) {
        console.error('Error fetching Wardens:', error);
        toast.error('Error fetching Wardens. Please try again.');
      }
    };

    fetchWardens();
  }, []);

  useEffect(() => {
    const fetchWings = async (flag) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}WingMst/getMstWingdrp`, {
          Flag: flag
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setWings(response.data.data);
        } else {
          toast.error('Failed to fetch Wings');
        }
      } catch (error) {
        console.error('Error fetching Wings:', error);
        toast.error('Error fetching Wings. Please try again.');
      }
    };

    fetchWings();
  }, []);

  // useEffect(() => {
  //   GetSourceName()
  //   GetSemesterName()
  //   GetInstituteeName()
  //   GetCourceName()
  //   getJobTitle()
  // }, [])
  const navigate = useNavigate()
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('2', event.target.value)
    setFormData(prevData => ({
      ...prevData,
      [name]: value,

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
    }));
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      // profession: event.target.value
    }));
    console.log('55', setFormData(prevData => ({
      ...prevData,
      [name]: value,
      // profession: event.target.value
    })))
  };

  const handleNextdata=async()=>{
    if (currentPropId) {
      await fetchPropertyData(currentPropId, "N");
    }
  }

  const handleBackdata=async()=>{
    if (currentPropId && currentPropId > 1) {
      await fetchPropertyData(currentPropId, "P");
    }
  }

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
        PropId: currentPropId || 0, 
        companyName: parseInt(formData.companyName),
        cobrMstId: parseInt(formData.branchName),
        propName: formData.propName,
        sqFt: formData.sqFt,
        pinId: parseInt(formData.pinId),
        pinId: parseInt(formData.pinCode),
        // pincode: formData.pincode,
        // areaName: formData.areaName,
        cityId: parseInt(formData.cityName) || 1,
        // cityName: formData.cityName,
        // stateName: formData.stateName,
        // countryName: formData.countryName,
        propEmail: formData.propEmail,
        propTel: formData.propTel,
        propTypeId: parseInt(formData.propTypName),
        propMob: formData.propMob,
        totalRooms: formData.totalRooms,
        totalBeds: formData.totalBeds,
        propImg: formData.propImg,
        hodEmpId: parseInt(formData.hodEmpName),
        wardenEmpId: parseInt(formData.wardenEmpName),
        propAdd: formData.propAdd,
        propGPSLoc: formData.propGPSLoc,
        Status: formData.Status || '1',
        Remark: formData.remark || '',
        CreatedBy: "1",
        UpdatedBy: "1" // Include this for update operations
    };
  
    console.log('Payload:', payload);
  
    try {
      const endpoint = currentPropId 
        ? `${process.env.REACT_APP_API_URL}PropertyMst/UpdatePropertyMst`
        : `${process.env.REACT_APP_API_URL}PropertyMst/InsertPropertyMst`;
  
      const response = await axios.post(endpoint, payload);
  
      if (response.data.status === 0) {
        toast.success(response.data.message);
        setIsEditing(false);
        setIsFormDisabled(true);
        if (!currentPropId) {
          setCurrentPropId(response.data.data.PropId); // Assuming the API returns the new ID
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
    setCurrentPropId(null);
    setFormData({
      companyName: '',
      branchName: '',
      propName: '',
      sqFt: '',
      pinCode: '',
      areaName: '',
      cityName: '',
      stateName: '',
      countryName: '',
      propEmail: '',
      propTel: '',
      propTypName: '',
      propMob: '',
      totalRooms: '',
      totalBeds: '',
      propImg: '',
      hodEmpName: '',
      wardenEmpName: '',
      propAdd: '',
      propGPSLoc: '',
      Status: '1',
      remark: '',
      CreatedBy: '1'
    });

    setActiveStep(0);
    setErrors({});
    setPropImg('');

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
          await fetchPropertyData(1, "L");
          setMode('view');
          setIsFormDisabled(true);
        } catch (error) {
          toast.error('Error occurred while cancelling. Please try again.');
        }
      } else if (mode === 'edit') {
        if (currentPropId) {
          await fetchPropertyData(currentPropId);
        }
        setMode('view');
        setIsFormDisabled(true);
      }
  
    };
  

  const handleDelete = () => {
    setIsConfirmDialogOpen(true);
  };
  // const handleConfirmDelete = async () => {
  //   try {
  //     await fetchPropertyData(currentPropId, "D");
  //     toast.success('Data deleted successfully');
  //     await fetchPropertyData(currentPropId, "N");
  //     setMode('view');
  //     setIsFormDisabled(true);
  //   } catch (error) {
  //     toast.error('Error deleting property. Please try again.');
  //   }
  //   setIsConfirmDialogOpen(false);
  // };

  const handleExit = () => {
    navigate('/propertytable')
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
            propImg: base64String
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

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    try {
      await fetchPropertyData(currentPropId, "D");
      await fetchPropertyData(currentPropId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Property:', error);
      toast.error('Error occurred while deleting. Please try again.');
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
                                  <InputLabel id="companyName-select-label">Company Name</InputLabel>
                                  <Select
                                    labelId="companyName-select-label"
                                    id="companyName-select"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="custom-textfield"
                                  >
                                    {companies.map((companyName) => (
                                      <MenuItem key={companyName.id} value={companyName.id}>
                                        {companyName.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={6} className='form_field'>
                                <FormControl variant="filled" fullWidth className="custom-select">
                                  <InputLabel id="branchName-select-label">Branch</InputLabel>
                                  <Select
                                    labelId="branchName-select-label"
                                    id="branchName-select"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    className="custom-textfield"
                                  >
                                    {branch.map((branchName) => (
                                      <MenuItem key={branchName.id} value={branchName.id}>
                                        {branchName.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Box>

                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Property Name"
                              name="propName"
                              value={formData.propName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl variant="filled" fullWidth className="custom-select">
                              <InputLabel id="propTypName-select-label">Property Type</InputLabel>
                              <Select
                                labelId="propTypName-select-label"
                                id="propTypName-select"
                                name="propTypName"
                                value={formData.propTypName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {propType.map((propTypeName) => (
                                  <MenuItem key={propTypeName.id} value={propTypeName.id}>
                                    {propTypeName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Sq.Ft Area"
                              name="sqFt"
                              value={formData.sqFt}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>


                        <Grid container spacing={2}>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Pincode"
                              name="pinCode"
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>

                          <Grid item xs={12} md={6} className='form_field'>
                            <FormControl variant="filled" fullWidth className="custom-select">
                              <InputLabel id="areaName-select-label">Area</InputLabel>
                              <Select
                                labelId="areaName-select-label"
                                id="areaName-select"
                                name="areaName"
                                value={formData.areaName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {area.length > 0 ? (
                                  area.map((areaItem) => (
                                    <MenuItem key={areaItem.id} value={areaItem.name}>
                                      {areaItem.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value="" disabled>
                                    No areas available
                                  </MenuItem>
                                )}
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
                        {formData.propImg ? (
                          <img
                            src={formData.propImg}
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

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="City"
                              name="cityName"
                              value={formData.cityName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="State"
                              name="stateName"
                              value={formData.stateName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Country"
                              name="countryName"
                              value={formData.countryName}
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
                              label="Email ID"
                              name="propEmail"
                              value={formData.propEmail}
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
                              name="propTel"
                              value={formData.propTel}
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
                              name="propMob"
                              value={formData.propMob}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>

                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid item lg={12} md={12} xs={12}>
                          {/* <Grid container spacing={3}> */}
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="No Of Rooms"
                                  name="totalRooms"
                                  value={formData.totalRooms}
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
                                  name="totalBeds"
                                  value={formData.totalBeds}
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
                          <Grid item xs={12} md={6} className='form_field'>
                            <FormControl variant="filled" fullWidth className="custom-select">
                              <InputLabel id="hodEmpName-select-label">HOD</InputLabel>
                              <Select
                                labelId="hodEmpName-select-label"
                                id="hodEmpName-select"
                                name="hodEmpName"
                                value={formData.hodEmpName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {hods.map((hodEmpName) => (
                                  <MenuItem key={hodEmpName.id} value={hodEmpName.id}>
                                    {hodEmpName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} className='form_field'>
                            <FormControl variant="filled" fullWidth className="custom-select">
                              <InputLabel id="wardenEmpName-select-label">Warden</InputLabel>
                              <Select
                                labelId="wardenEmpName-select-label"
                                id="wardenEmpName-select"
                                name="wardenEmpName"
                                value={formData.wardenEmpName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {wardens.map((wardenEmpName) => (
                                  <MenuItem key={wardenEmpName.id} value={wardenEmpName.id}>
                                    {wardenEmpName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>

                      </Box>
                    </Grid>

                    <Grid item display="flex" alignItems="center" justifyContent="center">

                      <Box>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={12} lg={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="propAdd"
                              value={formData.propAdd}
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

                    </Grid>
                  </Grid>

                </Grid>
              );
            case 1:
              return (
                <>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      onClick={handleDeleteClick}
                      size='small'
                      style={{ marginBottom: '20px' }}
                      sx={{
                        backgroundColor: '#635BFF',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#5249f',
                        },
                      }}
                    >
                      Add Floor
                    </Button>
                  </Grid>
                  <Paper sx={{ width: '75%', overflow: 'hidden', border: '1px solid lightgray' }}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow
                          >
                            <TableCell><b>Wing</b></TableCell>
                            <TableCell><b>Floor</b></TableCell>
                            <TableCell><b>No Of Rooms</b></TableCell>
                            <TableCell><b>Start No</b></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, index) => (
                            <TableRow key={index}
                              style={{ cursor: 'pointer' }}
                              sx={{
                                '& > td': {
                                  padding: '2px  14px 2px  19px'
                                }
                              }}
                            >
                              <TableCell>A</TableCell>
                              <TableCell>2</TableCell>
                              <TableCell>23</TableCell>
                              <TableCell>1</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                  <Grid
                    container
                    justifyContent="right"
                  >
                    <Button
                      variant="contained"
                      onClick={handleDeleteClick}
                      size='small'
                      style={{ margin: '20px 0' }}
                      sx={{
                        backgroundColor: '#635BFF',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#5249f',
                        },
                      }}
                    >
                      Generate Rooms
                    </Button>
                  </Grid>
                </>

              );
            case 2:
              return (
                ''
              );
            case 3:
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
            <Typography variant="h5">Property Master</Typography>
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
      {/* Floor Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            height: '286px',
            padding: '20px',
            // maxWidth: 'none'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Grid item lg={12} md={12} xs={12}>

            <Box display="flex" justifyContent="space-between" gap={2}>
              <Grid container spacing={2} >
                <Grid item xs={12} md={6} className='form_field'>
                  <FormControl variant="filled" fullWidth className="custom-select">
                    <InputLabel id="name-select-label">Wing</InputLabel>
                    <Select
                      labelId="name-select-label"
                      id="name-select"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="custom-textfield"
                    >
                      <Box display="flex" flexDirection="column">
                        {/* {wings.map((name) => (
                          <MenuItem key={name.id} value={name.id}>
                            {name.name}
                          </MenuItem>
                        ))} */}
                      </Box>

                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} >
                  <Button
                    variant="contained"
                    onClick={handleDeleteClick}
                    size='small'
                    sx={{
                      backgroundColor: '#635BFF',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#5249f',
                      },
                      marginLeft: '106px'
                    }}
                  >
                    Add Floors
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12} md={6} className='form_field' style={{ marginTop: '20px' }}>
              <FormControl variant="filled" fullWidth className="custom-select">
                <InputLabel id="wing-select-label">Floors</InputLabel>
                <Select
                  labelId="wing-select-label"
                  id="wing-select"
                  name="wing"
                  value={formData.wing}
                  onChange={handleInputChange}
                  className="custom-textfield"
                >
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center">
                      <Checkbox className="check_box" /> <MenuItem value={10}>1st Floor</MenuItem>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Checkbox className="check_box" /> <MenuItem value={20}>2nd Floor</MenuItem>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Checkbox className="check_box" /> <MenuItem value={30}>3rd Floor</MenuItem>
                    </Box>
                  </Box>

                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to select this record?
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
            Select
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
            onClick={handleCloseConfirmDialog}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StepperForm;