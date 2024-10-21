import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Button, TextField, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Autocomplete, Checkbox, Menu
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
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
import { FormLabel, RadioGroup, FormControlLabel, Radio, StepConnector, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { ConfirmDialog } from '../../ReusablePopup/CustomModel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

const columns = [
  { id: 'wingName', label: 'Wing', minWidth: 170 },
  { id: 'floorName', label: 'Floor', minWidth: 100 },
  { id: 'totalRooms', label: 'TotalRooms', minWidth: 100 },
  { id: 'startNo', label: 'Start No', minWidth: 100 }
];

const column = [
  { id: 'amenityName', label: 'Amenity', minWidth: 170 }
];

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mode, setMode] = useState('view');
  const [currentPropId, setCurrentPropId] = useState(null);
  const [hods, setHods] = useState([]);
  const [propertyId, setPropertyId] = useState();
  const [sites, setSites] = useState([]);
  const [propImg, setPropImg] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [area, setArea] = useState([]);
  const [floorConfig, setFloorConfig] = useState([]);
  const [branch, setBranch] = useState([]);
  const [propType, setPropType] = useState([]);
  const [wings, setWings] = useState([]);
  const [floors, setFloors] = useState([]);
  const location = useLocation();
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerms, setSearchTerms] = useState({});
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [editState, setEditState] = useState({});
  const [tableData, setTableData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Toggle the "Select All" checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedItems = floors.map((item) => ({
      ...item,
      isChecked: newSelectAll,
    }));
    setFloors(updatedItems);
  };

  // Handle individual checkbox toggle
  const handleCheckboxChange = (id) => {
    const updatedItems = floors.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setFloors(updatedItems);

    // Update "Select All" checkbox based on individual selections
    const allChecked = updatedItems.every((item) => item.isChecked);
    setSelectAll(allChecked);
  };

  useEffect(() => {
    console.log('111', location?.state?.propertyId)
    if (location.state && location.state?.propertyId) {
      setPropertyId(location.state.propertyId);
      fetchPropertyData(location.state?.propertyId);
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
        console.log('propertyData', propertyData)
        setFormData({
          propId: propertyData.propId,
          companyName: propertyData.companyName,
          branchName: propertyData.cobrMstId.toString(),
          propName: propertyData.propName,
          sqFt: propertyData.sqFt,
          pinCode: propertyData.pinId.toString(),
          areaName: propertyData.areaName,
          stateName: propertyData.stateName,
          countryName: propertyData.countryName,
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
        setPropertyId(propertyData?.propId);
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
    name: '' ,
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
        }
        // else {
        //   toast.error('Failed to fetch PincodeArea');
        // }
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

  useEffect(() => {
    const fetchFloors = async (flag) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}FloorMst/getFloorMstdrp`, {
          Flag: flag
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setFloors(response.data.data);
        } else {
          toast.error('Failed to fetch Floors');
        }
      } catch (error) {
        console.error('Error fetching Floors:', error);
        toast.error('Error fetching Floors. Please try again.');
      }
    };

    fetchFloors();
  }, []);

  // useEffect(() => {
  //   GetSourceName()
  //   GetSemesterName()
  //   GetInstituteeName()
  //   GetCourceName()
  //   getJobTitle()
  // }, [])

  useEffect(() => {
    fetchFloorConfig();
  }, []);

  const fetchFloorConfig = async (id) => {
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstPropFloorConfig/GetMstPropAmenityConfigDashBoard`, {
        propId: id,
        amenityId: id
      });
      
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        setFloorConfig(response.data.data);
        
      } else {
        console.error('Error fetching floor configuration data:', response.data.message);
      }
      console.log(response, "res")
    } catch (error) {
      console.error('Error fetching floor configuration data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate('/floor');
  };

  const handleSearchChange = (columnId, value) => {
    setSearchTerms(prev => ({ ...prev, [columnId]: value }));
    setPage(0);
  };

  const handleEditChange = (propId, columnId, value) => {
    setEditState(prev => ({
      ...prev,
      [propId]: {
        ...prev[propId],
        [columnId]: value,
      },
    }));
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => {
      return Object.entries(searchTerms).every(([columnId, term]) => {
        if (!term) return true;
        const value = row[columnId];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return true;
      });
    });
  }, [searchTerms, rows]);

  const handleRowDoubleClick = () => {

    navigate('', { state: { mode: 'view' } });
  };

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

  const handleNextdata = async () => {
    if (propertyId) {
      await fetchPropertyData(propertyId, "N");
    }
  }

  const handleBackdata = async () => {
    if (propertyId && propertyId > 1) {
      await fetchPropertyData(propertyId, "P");
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    const payload = {
      PropId: propertyId || 0,
      companyName: parseInt(formData.companyName),
      cobrMstId: parseInt(formData.branchName),
      propName: formData.propName,
      sqFt: formData.sqFt,
      pinId: parseInt(formData.pinId),
      pinId: parseInt(formData.pinCode),
      // pincode: formData.pincode,
      areaName: formData.areaName,
      cityId: parseInt(formData.cityName) || 1,
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
      const endpoint = propertyId
        ? `${process.env.REACT_APP_API_URL}PropertyMst/UpdatePropertyMst`
        : `${process.env.REACT_APP_API_URL}PropertyMst/InsertPropertyMst`;

      const response = await axios.post(endpoint, payload);

      if (response.data.status === 0) {
        toast.success(response.data.message);
        setIsEditing(false);
        setIsFormDisabled(true);
        if (!propertyId) {
          setPropertyId(response.data.data.propertyId); // Assuming the API returns the new ID
        }
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const handleSelect = () => {
    // Collect the selected data
    const selectedFloors = floors.filter((floor) => floor.isChecked);
    const newTableData = selectedFloors.map((floor) => ({
      wing: formData.name,
      floor: floor.name,
    }));

    // Update table data state
    setTableData(newTableData);
    handleClose(); // Close the menu after selection
  };

  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
    setPropertyId(null);
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
      name: '' ,
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
      if (propertyId) {
        await fetchPropertyData(propertyId);
      }
      setMode('view');
      setIsFormDisabled(true);
    }

  };

  const deleteItem = () => {
    setOpenConfirmDialog(true);
  };

  const closeConfirmation = () => {
    setOpenConfirmDialog(false);
  };

  const onDeleteConfirm = async () => {
    try {
      await fetchPropertyData(propertyId, "D");
      // toast.success('Data deleted successfully');
      await fetchPropertyData(propertyId, "N");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error deleting property. Please try again.');
    }
    setOpenConfirmDialog(false);
  };

  const handleDelete = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetchPropertyData(propertyId, "D");
      // toast.success('Data deleted successfully');
      await fetchPropertyData(propertyId, "N");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error deleting property. Please try again.');
    }
    setIsConfirmDialogOpen(false);
  };

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
                  <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    <Grid container gap={2}
                      sx={{
                        padding: '20px 30px',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={deleteItem}
                        sx={{
                          backgroundColor: '#7c3aed ',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#7c3aed ',
                          },
                        }}
                      >
                        Add Floor
                      </Button>
                      <Button
                        variant="contained"
                        onClick={deleteItem}
                        sx={{
                          backgroundColor: '#7c3aed ',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#7c3aed ',
                          },
                        }}
                      >
                        Clear All
                      </Button>
                    </Grid>
                    <Paper sx={{ width: '80%', overflow: 'hidden', margin: '0px 0px 0px 50px', border: '1px solid lightgray' }}>
                      <TableContainer sx={{ maxHeight: 450 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow
                              sx={{
                                '& > th': {
                                  padding: '2px  10px 2px  24px',
                                },
                              }}
                            >
                              {columns.map(column => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {column.label}
                                  </Typography>
                                  <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={`Search ${column.label}`}
                                    onChange={e => handleSearchChange(column.id, e.target.value)}
                                    sx={{
                                      mt: 1,
                                      margin: '0px',
                                      '& .MuiOutlinedInput-input': {
                                        padding: '2px 6px',
                                      },
                                    }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                            {/* <Button
                              variant="contained"
                              onClick={handleClick}
                              size='small'
                              sx={{
                                backgroundColor: '#635BFF',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#5249f',
                                },
                                height: '22.5px',
                                bottom: 2
                              }}
                            >
                              Delete
                            </Button> */}
                          </TableHead>
                          <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row}
                                  onDoubleClick={() => handleRowDoubleClick(row)}
                                  style={{ cursor: 'pointer' }}
                                  sx={{
                                    '& > td': {
                                      padding: '2px  14px 2px  24px',
                                    },
                                  }}
                                >
                                  {columns.map(column => {
                                    const value = editState[row.propId]?.[column.id] ?? row[column.id];
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {['totalRooms', 'startNo'].includes(column.id) ? (
                                          <TextField
                                            size="small"
                                            value={value}
                                            onChange={e => handleEditChange(row.propId, column.id, e.target.value)}
                                            sx={{
                                              '& .MuiOutlinedInput-input': {
                                                padding: '2px 6px',
                                              },
                                            }}
                                          />
                                        ) : (
                                          value
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  </Box>
                </>
              );
            case 2:
              return (
                <>
                  <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    <Grid container gap={2}
                      sx={{
                        padding: '20px 30px',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleMenuClick}
                        sx={{
                          backgroundColor: '#7c3aed ',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#7c3aed ',
                          },
                        }}
                        variant="contained"
                      >
                        Add Amenity
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <>
                          <List>
                            <ListItem style={{ height: '450px', width: '200px', overflowY: 'auto' }}>
                              <div>
                                <h3>Select Floors</h3>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                  Select All
                                </label>

                                {floors.map((item) => (
                                  <div key={item.id}>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={item.isChecked}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                      {item.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </ListItem>
                          </List>
                        </>
                      </Menu>
                      <Button
                        variant="contained"
                        onClick={deleteItem}
                        sx={{
                          backgroundColor: '#7c3aed ',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#7c3aed ',
                          },
                        }}
                      >
                        Clear All
                      </Button>
                    </Grid>
                    <Grid item xs={12} className='form_field'>
                      <Grid container spacing={1} gap={2}
                        sx={{
                          margin: '10px 0',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={deleteItem}
                          sx={{
                            backgroundColor: '#7c3aed ',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#7c3aed ',
                            },
                            bottom: -3
                          }}
                        >
                          Select
                        </Button>
                        <Button
                          variant="contained"
                          onClick={deleteItem}
                          sx={{
                            backgroundColor: '#7c3aed ',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#7c3aed ',
                            },
                            bottom: -3
                          }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                    <Paper sx={{ width: '34%', overflow: 'hidden', margin: '0px 0px 0px 50px', border: '1px solid lightgray' }}>
                      <TableContainer sx={{ maxHeight: 450 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow
                              sx={{
                                '& > th': {
                                  padding: '2px  10px 2px  24px'
                                },
                              }}
                            >
                              {column.map(column => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {column.label}
                                  </Typography>
                                  <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={`Search ${column.label}`}
                                    onChange={e => handleSearchChange(column.id, e.target.value)}
                                    sx={{
                                      mt: 1,
                                      margin: '0px',
                                      '& .MuiOutlinedInput-input': {
                                        padding: '2px 6px',
                                      },
                                    }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                            {/* <Button
                              variant="contained"
                              onClick={handleClick}
                              size='small'
                              sx={{
                                backgroundColor: '#635BFF',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#5249f',
                                },
                                height: '22.5px',
                                bottom: 2
                              }}
                            >
                              Delete
                            </Button> */}
                          </TableHead>
                          <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row}
                                  onDoubleClick={() => handleRowDoubleClick(row)}
                                  style={{ cursor: 'pointer' }}
                                  sx={{
                                    '& > td': {
                                      padding: '2px  14px 2px  24px',
                                    },
                                  }}
                                >
                                  {columns.map(column => {
                                    const value = editState[row.propId]?.[column.id] ?? row[column.id];
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {['amenityName'].includes(column.id) ? (
                                          <TextField
                                            size="small"
                                            value={value}
                                            onChange={e => handleEditChange(row.propId, column.id, e.target.value)}
                                            sx={{
                                              '& .MuiOutlinedInput-input': {
                                                padding: '2px 6px',
                                              },
                                            }}
                                          />
                                        ) : (
                                          value
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  </Box>
                </>
              );
            default:
              return null;
          }
        })()}
      </Box>
    );
  };
  const handleStepClick = (step) => {
    if (mode === 'view') {
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
                <Step key={label} onClick={() => handleStepClick(index)} style={{ cursor: mode === 'view' ? 'pointer' : 'default' }}>
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
              disabled={mode === "view"}
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
        onClose={closeConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            height: '230px',
            padding: '20px'
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
                      {wings.map((name) => (
                        <MenuItem key={name.id} value={name.id}>
                          {name.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#7c3aed' }}
                    onClick={handleClick}
                  // disabled={mode !== 'view'}
                  >
                    <AddIcon /><Typography style={{ marginLeft: '2px' }}>Add Floors</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12} md={6} className='form_field' style={{ marginTop: '20px' }}>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
                variant="contained"
              >
                Floors
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <>
                  <List>
                    <ListItem style={{ height: '450px', width: '200px', overflowY: 'auto' }}>
                      <div>
                        <h3>Select Floors</h3>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                          Select All
                        </label>

                        {floors.map((item) => (
                          <div key={item.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ListItem>
                  </List>
                </>
              </Menu>

            </Grid>
          </Grid>
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to select this record?
          </DialogContentText>
        </DialogContent> */}
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
            onClick={closeConfirmation}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StepperForm;