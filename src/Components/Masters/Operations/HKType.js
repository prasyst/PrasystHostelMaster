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

const HkType = () => {
  const [formData, setFormData] = useState({
    HkTypeName: '',
    Abrv: '',
    Remark: ''
  });

  const [error, setError] = useState({
    HkTypeName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
//   const [floorId, setFloorId] = useState(null);
  const location = useLocation();
  const [currentHkTypeId, setCurrentHkTypeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedHkTypeId, setLastInsertedHkTypeId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const HkTypeNameRef = useRef(null);
  const AbrvRef = useRef(null);
  const RemarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.HkTypeId) {
      setCurrentHkTypeId(location.state.HkTypeId);
      fetchHkTypeData(location.state.HkTypeId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchHkTypeData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstHkType/RetriveMstHkType`, { 
        HkTypeId: parseInt(id),
        Flag: flag 
      }, AuthHeader());
 
      if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
        const HkTypeData = response.data.Data[0];
        setFormData({
          HkTypeName: HkTypeData.HkTypeName, 
          Abrv: HkTypeData.Abrv,
          Remark: HkTypeData.Remark
        });
        setIsFormDisabled(true);
        setCurrentHkTypeId(HkTypeData.HkTypeId); 
        console.log("res", response);
      } else if (response.data.Status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch housekeepingtype data');
      }
    } catch (error) {
      console.error('Error fetching housekeepingtype data:', error);
      toast.error('Error fetching housekeepingtype data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentHkTypeId && currentHkTypeId > 1) {
      await fetchHkTypeData(currentHkTypeId, "P");
    }
  };

  const handleNext = async () => {
    if (currentHkTypeId) {
      await fetchHkTypeData(currentHkTypeId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

  if (name === 'HkType') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'HkType' && value !== '') {
    setTimeout(() => {
      AbrvRef.current.focus();
    }, 100000);
  }
};

// const handleKeyPress = (event) => {
//   if (event.key === 'Enter') {
//     AbrvRef.current.focus();
//   }
// };

const handleKeyPress = (event, nextRef) => {
  if (event.key === 'Enter' && nextRef) {
    event.preventDefault(); // Prevent form submission
    nextRef.current.focus(); // Focus on the next input
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.HkTypeName) {
    toast.error('HkTypeName is required');
    setError(prev => ({ ...prev, HkTypeName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, HkTypeName: false }));
  }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      HkTypeName: formData.HkTypeName,
      Abrv: formData.Abrv,
      Remark: formData.Remark,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.HkTypeId = currentHkTypeId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}MstHkType/UpdateMstHkType`, payload, AuthHeader());
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}MstHkType/InsertMstHkType`, payload, AuthHeader());
    }

    if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedHkTypeId(response.data.Data)
        console.log(response.data.Data)
        await fetchHkTypeData(response.data.Data);
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
        setCurrentHkTypeId(response.data.Data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } 
    // else {
    //   toast.error(response.data.message || 'Operation failed');
    // }
  } catch (error) {
    console.error('Error saving/updating housekeepingtype:', error);
    toast.error('Error saving/updating housekeepingtype. Please try again.');
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
      HkTypeName: '',
      Abrv: '',
      Remark: ''
    });
    setCurrentHkTypeId(null);

    setTimeout(() => {
      HkTypeNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchHkTypeData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      HkTypeName: '',
      Abrv: '',
      Remark: ''
    });
    setCurrentHkTypeId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/hkTypeTable')
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
      await fetchHkTypeData(currentHkTypeId, "D");
      // toast.success('Data deleted successfully');
      await fetchHkTypeData(currentHkTypeId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting housekeepingtype:', error);
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
            disabled={mode !== 'view' || !currentHkTypeId || currentHkTypeId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentHkTypeId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>HouseKeepingType Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentHkTypeId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentHkTypeId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentHkTypeId || currentHkTypeId === 0}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentHkTypeId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="HkTypeName"
               name="HkTypeName"
               label={
                <span>
                  HkTypeName <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.HkTypeName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.HkTypeName}
               helperText={error.HkTypeName && ""}
               inputRef={HkTypeNameRef}
              //  onKeyDown={handleKeyPress}
               onKeyDown={(event) => handleKeyPress(event, AbrvRef)}
              />
             </Grid>
             <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="Abrv"
                  name="Abrv"
                  label="Abrv"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.Abrv}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={AbrvRef}
                  // onKeyDown={handleKeyPress}
                  onKeyDown={(event) => handleKeyPress(event, RemarkRef)}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="Remark"
                  name="Remark"
                  label="Remark"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.Remark}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={RemarkRef}
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
              // disabled={!currentZoneId}
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

export default HkType
