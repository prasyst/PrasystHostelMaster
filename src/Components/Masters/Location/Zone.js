import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate ,useLocation} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AuthHeader from '../../../Auth';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  },
  '& .Mui-focused': {
    borderColor: '#673ab7',
  },
  '& .MuiFilledInput-root.Mui-focused': {
    border: '1px solid #673ab7',
  },
}));

const Zone = () => {
  const [formData, setFormData] = useState({
    ZoneName: '',
    ZoneCode: '',
    ShortName: ''
  });

  const [error, setError] = useState({
    zoneName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [zoneId, setZoneId] = useState(null);
  const location = useLocation();
  const [currentZoneId, setCurrentZoneId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedZoneId, setLastInsertedZoneId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const zoneNameRef = useRef(null);
  const zoneCodeRef = useRef(null);
  const shortNameRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.ZoneId) {
      setCurrentZoneId(location.state.ZoneId);
      fetchZoneData(location.state.ZoneId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchZoneData = async (id, flag) => {
    try {
      const response = await axios.post('http://43.230.196.21/api/zoneRegionMst/RetrivezoneRegionMst', { 
        ZoneId: parseInt(id),
        Flag: flag 
      }, AuthHeader());
 
      if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
        const zoneData = response.data.Data[0];
        setFormData({
          ZoneName: zoneData.ZoneName, 
          ZoneCode: zoneData.ZoneCode,
          ShortName: zoneData.ZoneAbrv
        });
        setIsFormDisabled(true);
        setCurrentZoneId(zoneData.ZoneId); 
      } else if (response.data.Status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.Message);
      } else {
        toast.error('Failed to fetch zone data');
      }
    } catch (error) {
      console.error('Error fetching zone data:', error);
      toast.error('Error fetching zone data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentZoneId && currentZoneId > 1) {
      await fetchZoneData(currentZoneId, "P");
    }
  };

  const handleNext = async () => {
    if (currentZoneId) {
      await fetchZoneData(currentZoneId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'zone') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'zone' && value !== '') {
    setTimeout(() => {
      shortNameRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === zoneCodeRef.current) {
      shortNameRef.current.focus();
    } else {
      zoneCodeRef.current.focus();
    }
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.ZoneName) {
    toast.error('Zone name is required');
    setError(prev => ({ ...prev, ZoneName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, ZoneName: false }));
  }

  // if (!formData.zoneCode) {
  //   toast.error('Zone code is required');
  //   setError(prev => ({ ...prev, zoneCode: true }));
  //   hasError = true;
  // } else if (!/^[0-9]+$/.test(formData.zoneCode) && !/^[A-Za-z]+$/.test(formData.zoneCode)) {
  //   toast.error('Zone code must be numeric or alphabetic characters');
  //   setError(prev => ({ ...prev, zoneCode: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, zoneCode: false }));
  // }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      ZoneName: formData.ZoneName,
      ZoneCode: formData.ZoneCode,
      ZoneAbrv: formData.ShortName,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.ZoneId = currentZoneId;
      response = await axios.patch('http://43.230.196.21/api/zoneRegionMst/UpdatezoneRegionMst', payload, AuthHeader());
    } else {
      response = await axios.post('http://43.230.196.21/api/zoneRegionMst/InsertzoneRegionMst', payload, AuthHeader());
    }

    if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.Message);
      if (mode === 'add') {
        setLastInsertedZoneId(response.data.Data)
        console.log(response.data.Data)
        await fetchZoneData(response.data.Data);
        // setFormData({
        //   country: '',
        //   state: '',
        //   zone: '',
        //   city: '',
        //   shortName: '',
        //   cityCode: ''
        // });
        setMode('view');
        setIsFormDisabled(true);
        setCurrentZoneId(response.data.Data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.Message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating zone:', error);
    toast.error('Error saving/updating zone. Please try again.');
  }
};


  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
  };

  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
    setFormData({
      ZoneName: '',
      ZoneCode: '',
      ShortName: ''
    });
    setCurrentZoneId(null);

    setTimeout(() => {
      zoneNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchZoneData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      ZoneName: '',
      ZoneCode: '',
      ShortName: ''
    });
    setCurrentZoneId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/zonetable')
  }

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    try {
      await fetchZoneData(currentZoneId, "D");
      await fetchZoneData(currentZoneId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };

  return (
    <>

      <Box className="form-container">
   
      <ToastContainer />
        <Grid container spacing={2} className='form_grid'>
        <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', marginTop: '20px' }}>
          <Grid>
          <Button 
            variant="contained" 
            size="small" 
            className='three-d-button-previous'
            onClick={handlePrevious}
            disabled={mode !== 'view' || !currentZoneId || currentZoneId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentZoneId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3>Zone Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentZoneId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentZoneId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentZoneId || currentZoneId === 1}
          >
            <DeleteIcon />
          </Button>       
      
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentZoneId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="ZoneName"
               name="ZoneName"
               label={
                <span>
                  Zone <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.ZoneName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.zoneName}
               helperText={error.zoneName && ""}
               inputRef={zoneNameRef}
               onKeyDown={handleKeyPress}
              />
             </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="ZoneCode"
                  name="ZoneCode"
                  label="Zone Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.ZoneCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.zoneCode}
                  helperText={error.zoneCode && ""}
                  inputRef={zoneCodeRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="ShortName"
                  name="ShortName"
                  label="Short Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.ShortName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={shortNameRef}
                />
              </Grid>
            </Grid>
          </Grid>

        <Grid item xs={12} className="form_button">
          {mode === 'view' && (
            <>
              <Button variant="contained" sx={{ mr: 1 , background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                Submit
              </Button>
              <Button variant="contained" sx={{ mr: 1 , background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit} 
              disabled
              >
              Cancel
              </Button>
            </>
          )}
          {(mode === 'edit' || mode === 'add') && (
            <>
           
            <Button variant="contained" sx={{ mr: 1 }} onClick={handleSave}>
                Submit
              </Button>
              <Button variant="contained" sx={{ mr: 1 }} onClick={handleCancel}>
                Cancel
              </Button>
             
            </>
          )}
        </Grid>
        </Grid>
      </Box>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
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
            onClick={handleCloseConfirmDialog}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Zone