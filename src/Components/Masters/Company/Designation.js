import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import {
  Typography, FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

const DesignationMaster = () => {
  const [formData, setFormData] = useState({
    desiName: '',
    remark: ''
  });

  const [error, setError] = useState({
    desiName: false,
    remark: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [designationId, setDesignationId] = useState(null);
  const location = useLocation();
  const [currentDesignationId, setCurrentDesignationId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [mode, setMode] = useState('view');
  const [lastInsertedDesignationId, setLastInsertedDesignationId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const desiNameRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.desiId) {
      setCurrentDesignationId(location.state.desiId);
      fetchDesignationData(location.state.desiId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchDesignationData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstDesi/RetriveMstDesi`, {
        desiId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const designationData = response.data.data[0];
        setFormData({
          desiName: designationData.desiName,
          remark: designationData.remark
        });
        setIsFormDisabled(true);
        setCurrentDesignationId(designationData.desiId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch designation data');
      }
    } catch (error) {
      console.error('Error fetching designation data:', error);
      toast.error('Error fetching designation data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}MstDesi/getMstDesidrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setDesignations(response.data.data);
        } else {
          toast.error('Failed to fetch DesignationName');
        }
      } catch (error) {
        console.error('Error fetching DesignationName:', error);
        toast.error('Error fetching DesignationName. Please try again.');
      }
    };

    fetchDesignations();
  }, []);

  const handlePrevious = async () => {
    if (currentDesignationId && currentDesignationId > 1) {
      await fetchDesignationData(currentDesignationId, "P");
    }
  };

  const handleNext = async () => {
    if (currentDesignationId) {
      await fetchDesignationData(currentDesignationId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'designation') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'designation' && value !== '') {
      setTimeout(() => {
        remarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      remarkRef.current.focus();
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.desiName) {
      toast.error('Description Name is required');
      setError(prev => ({ ...prev, desiName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, desiName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        desiName: formData.desiName,
        remark: formData.remark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.desiId = currentDesignationId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}MstDesi/UpdateMstDesi`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}MstDesi/InsertMstDesi`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedDesignationId(response.data.data)
          console.log(response.data.data)
          await fetchDesignationData(response.data.data);
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
          setCurrentDesignationId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating Designation:', error);
      toast.error('Error saving/updating Designation. Please try again.');
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
      desiName: '',
      remark: ''
    });
    setCurrentDesignationId(null);

    setTimeout(() => {
      desiNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchDesignationData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      desiName: '',
      remark: ''
    });
    setCurrentDesignationId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/designationtable')
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
      await fetchDesignationData(currentDesignationId, "D");
      await fetchDesignationData(currentDesignationId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Designation:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };

  return (
    <>

      <Box className="form-container">

        <ToastContainer />
        <Grid container spacing={2} className='form_grid'>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                className='three-d-button-previous'
                onClick={handlePrevious}
                disabled={mode !== 'view' || !currentDesignationId || currentDesignationId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentDesignationId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Designation Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentDesignationId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentDesignationId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentDesignationId || currentDesignationId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentDesignationId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
               id="desiName"
               name="desiName"
               label={
                <span>
                  DesignationName <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.desiName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.desiName}
               helperText={error.desiName && ""}
               inputRef={desiNameRef}
               onKeyDown={handleKeyPress}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="remark"
                  name="remark"
                  label="Remark"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.remark}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={remarkRef}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit}
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

export default DesignationMaster