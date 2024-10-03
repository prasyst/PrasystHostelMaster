import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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

const Complaint = () => {
  const [formData, setFormData] = useState({
    compTypeName: '',
    compName: '',
    compAbrv: '',
    compRemark: ''
  });

  const [error, setError] = useState({
    compTypeName: false,
    compName: false,
    compAbrv: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [compId, setCompId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const location = useLocation();
  const [currentCompId, setCurrentCompId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedCompId, setLastInsertedCompId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const compTypeNameRef = useRef(null);
  const compNameRef = useRef(null);
  const compAbrvRef = useRef(null);
  const compRemarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.compId) {
      setCurrentCompId(location.state.compId);
      fetchComplaintData(location.state.compId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchComplaintData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}ComplaintMst/RetriveComplaintMst`, {
        compId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const compData = response.data.data[0];
        setFormData({
          compTypeName: compData.compTypeId.toString(),
          compName: compData.compName,
          compAbrv: compData.compAbrv,
          compRemark: compData.compRemark
        });
        setIsFormDisabled(true);
        setCurrentCompId(compData.compId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch complaint master data');
      }
    } catch (error) {
      console.error('Error fetching complaint master data:', error);
      toast.error('Error fetching complaint master data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchComTypeName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}ComplaintMst/getComplaintMstdrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setComplaints(response.data.data);
        } else {
          toast.error('Failed to fetch ComplaintTypeName ');
        }
      } catch (error) {
        console.error('Error fetching ComplaintTypeName:', error);
        toast.error('Error fetching ComplaintTypeName. Please try again.');
      }
    };

    fetchComTypeName ();
  }, []);

  const handlePrevious = async () => {
    if (currentCompId && currentCompId > 1) {
      await fetchComplaintData(currentCompId, "P");
    }
  };

  const handleNext = async () => {
    if (currentCompId) {
      await fetchComplaintData(currentCompId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'comp') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'comp' && value !== '') {
      setTimeout(() => {
        compRemarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if(event.target === compNameRef.current){
        compAbrvRef.current.focus();
      } else {
        compRemarkRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.compName) {
      toast.error('Complaint Name is required');
      setError(prev => ({ ...prev, compName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, compName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        compTypeId: parseInt(formData.compTypeName),
        compName: formData.compName,
        compAbrv: formData.compAbrv,
        compRemark: formData.compRemark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.compId = currentCompId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}ComplaintMst/InsertComplaintMst`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}ComplaintMst/UpdateComplaintMst`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedCompId(response.data.data)
          console.log(response.data.data)
          await fetchComplaintData(response.data.data);
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
          setCurrentCompId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating Complaint Master:', error);
      toast.error('Error saving/updating Complaint Master. Please try again.');
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
      compName: '',
      compAbrv: '',
      compRemark: ''
    });
    setCurrentCompId(null);

    setTimeout(() => {
      compNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchComplaintData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      compTypeName: '',
      compName: '',
      compAbrv: '',
      compRemark: ''
    });
    setCurrentCompId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/complaintTable')
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
      await fetchComplaintData(currentCompId, "D");
      await fetchComplaintData(currentCompId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting complaint Master:', error);
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
                disabled={mode !== 'view' || !currentCompId || currentCompId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentCompId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Complaint Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentCompId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentCompId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentCompId || currentCompId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentCompId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6} className='form_field'>
            <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="compTypeName-select-label">CompTypeName</InputLabel>
              <Select
                labelId="compTypeName-select-label"
                id="compTypeName-select"
                name="compTypeName"
                value={formData.compTypeName}
                onChange={handleInputChange}
                className="custom-textfield"
                disabled={isFormDisabled}
                inputRef={compTypeNameRef}
                onKeyDown={handleKeyPress}
              >
                {complaints.map((compTypeName) => (
                
                  <MenuItem key={compTypeName.id} value={compTypeName.id}>{compTypeName.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <CountryAutocomplete
              countries={countries}
              value={formData.country}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.country}
              helperText={error.country ? '' : ''}
              ref={countryRef}
              onKeyDown={handleKeyPress}
            /> */}
          </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="compName"
                  name="compName"
                  label={
                    <span>
                      ComplaintName <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.compName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.compName}
                  helperText={error.compName && ""}
                  inputRef={compNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="compAbrv"
                  name="compAbrv"
                  label="CompAbrv"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.compAbrv}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={compAbrvRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CompRemark"
                  name="compRemark"
                  value={formData.compRemark}
                  onChange={handleInputChange}
                  variant="filled"
                  disabled={isFormDisabled}
                  className="custom-textfield"
                  inputRef={compRemarkRef}
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

export default Complaint