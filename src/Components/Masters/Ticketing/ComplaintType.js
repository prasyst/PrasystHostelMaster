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

const ComplaintType = () => {
  const [formData, setFormData] = useState({
    compTypeName: '',
    compTypeAbrv: '',
    compTypeRemark: ''
  });

  const [error, setError] = useState({
    compTypeName: false,
    compTypeAbrv: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [compTypeId, setCompTypeId] = useState(null);
  const location = useLocation();
  const [currentCompTypeId, setCurrentCompTypeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedCompTypeId, setLastInsertedCompTypeId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const compTypeNameRef = useRef(null);
  const compTypeAbrvRef = useRef(null);
  const compTypeRemarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.compTypeId) {
      setCurrentCompTypeId(location.state.compTypeId);
      fetchCompTypeData(location.state.compTypeId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchCompTypeData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}ComplaintTypeMst/RetriveComplaintTypeMst`, {
        compTypeId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const compTypeData = response.data.data[0];
        setFormData({
          compTypeName: compTypeData.compTypeName,
          compTypeAbrv: compTypeData.compTypeAbrv,
          compTypeRemark: compTypeData.compTypeRemark
        });
        setIsFormDisabled(true);
        setCurrentCompTypeId(compTypeData.compTypeId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch complaintType master data');
      }
    } catch (error) {
      console.error('Error fetching complaintType master data:', error);
      toast.error('Error fetching complaintType master data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentCompTypeId && currentCompTypeId > 1) {
      await fetchCompTypeData(currentCompTypeId, "P");
    }
  };

  const handleNext = async () => {
    if (currentCompTypeId) {
      await fetchCompTypeData(currentCompTypeId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'compType') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'compType' && value !== '') {
      setTimeout(() => {
        compTypeRemarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === compTypeNameRef.current) {
        compTypeAbrvRef.current.focus();
      } else if(event.target === compTypeNameRef.current){
        compTypeRemarkRef.current.focus();
      } else {
        compTypeRemarkRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.compTypeName) {
      toast.error('ComplaintType Name is required');
      setError(prev => ({ ...prev, compTypeName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, compTypeName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        compTypeName: formData.compTypeName,
        compTypeAbrv: formData.compTypeAbrv,
        compTypeRemark: formData.compTypeRemark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.compTypeId = currentCompTypeId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}ComplaintTypeMst/InsertComplaintTypeMst`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}ComplaintTypeMst/UpdateComplaintTypeMst`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedCompTypeId(response.data.data)
          console.log(response.data.data)
          await fetchCompTypeData(response.data.data);
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
          setCurrentCompTypeId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating ComplaintType Master:', error);
      toast.error('Error saving/updating ComplaintType Master. Please try again.');
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
      compTypeName: '',
      compTypeAbrv: '',
      compTypeRemark: ''
    });
    setCurrentCompTypeId(null);

    setTimeout(() => {
      compTypeNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchCompTypeData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      compTypeName: '',
      compTypeAbrv: '',
      compTypeRemark: ''
    });
    setCurrentCompTypeId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/complaintTypeTable')
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
      await fetchCompTypeData(currentCompTypeId, "D");
      await fetchCompTypeData(currentCompTypeId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting complaintType Master:', error);
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
                disabled={mode !== 'view' || !currentCompTypeId || currentCompTypeId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentCompTypeId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>ComplaintType Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentCompTypeId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentCompTypeId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentCompTypeId || currentCompTypeId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentCompTypeId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="compTypeName"
                  name="compTypeName"
                  label={
                    <span>
                      ComplaintType <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.compTypeName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.compTypeName}
                  helperText={error.compTypeName && ""}
                  inputRef={compTypeNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="compTypeAbrv"
                  name="compTypeAbrv"
                  label="Abrv"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.compTypeAbrv}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={compTypeAbrvRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Remark"
                  name="compTypeRemark"
                  value={formData.compTypeRemark}
                  onChange={handleInputChange}
                  variant="filled"
                  disabled={isFormDisabled}
                  className="custom-textfield"
                  inputRef={compTypeRemarkRef}
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

export default ComplaintType