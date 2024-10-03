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

const InstituteMaster = () => {
  const [formData, setFormData] = useState({
    instituteName: '',
    addr: '',
    remark: ''
  });

  const [error, setError] = useState({
    instituteName: false,
    addr: false,
    remark: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [instituteId, setInstituteId] = useState(null);
  const location = useLocation();
  const [currentInstituteId, setCurrentInstituteId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedInstituteId, setLastInsertedInstituteId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const instituteNameRef = useRef(null);
  const addrRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.instituteId) {
      setCurrentInstituteId(location.state.instituteId);
      fetchInstituteData(location.state.instituteId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchInstituteData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstInstitute/RetriveMstInstitute`, {
        instituteId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const instituteData = response.data.data[0];
        setFormData({
          instituteName: instituteData.instituteName,
          addr: instituteData.addr,
          remark: instituteData.remark
        });
        setIsFormDisabled(true);
        setCurrentInstituteId(instituteData.instituteId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch institute master data');
      }
    } catch (error) {
      console.error('Error fetching institute master data:', error);
      toast.error('Error fetching institute master data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentInstituteId && currentInstituteId > 1) {
      await fetchInstituteData(currentInstituteId, "P");
    }
  };

  const handleNext = async () => {
    if (currentInstituteId) {
      await fetchInstituteData(currentInstituteId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'institute') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'institute' && value !== '') {
      setTimeout(() => {
        remarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === addrRef.current) {
        remarkRef.current.focus();
      } else {
        addrRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.instituteName) {
      toast.error('Institute name is required');
      setError(prev => ({ ...prev, instituteName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, instituteName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        instituteName: formData.instituteName,
        addr: formData.addr,
        remark: formData.remark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.instituteId = currentInstituteId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}MstInstitute/UpdateMstInstitute`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}MstInstitute/InsertMstInstitute`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedInstituteId(response.data.data)
          console.log(response.data.data)
          await fetchInstituteData(response.data.data);
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
          setCurrentInstituteId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating Institute Master:', error);
      toast.error('Error saving/updating Institute Master. Please try again.');
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
      instituteName: '',
      addr: '',
      remark: ''
    });
    setCurrentInstituteId(null);

    setTimeout(() => {
      instituteNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchInstituteData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      instituteName: '',
      addr: '',
      remark: ''
    });
    setCurrentInstituteId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/instituteMasterTable')
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
      await fetchInstituteData(currentInstituteId, "D");
      await fetchInstituteData(currentInstituteId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Institute Master:', error);
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
                disabled={mode !== 'view' || !currentInstituteId || currentInstituteId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentInstituteId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Institute Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentInstituteId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentInstituteId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentInstituteId || currentInstituteId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentInstituteId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="instituteName"
                  name="instituteName"
                  label={
                    <span>
                      Institute <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.instituteName}
                  helperText={error.instituteName && ""}
                  inputRef={instituteNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="addr"
                  name="addr"
                  label="Address"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.addr}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={addrRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  variant="filled"
                  disabled={isFormDisabled}
                  className="custom-textfield"
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

export default InstituteMaster