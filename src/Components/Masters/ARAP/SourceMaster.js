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

const SourceMaster = () => {
  const [formData, setFormData] = useState({
    sourceName: '',
    remark: ''
  });

  const [error, setError] = useState({
    sourceName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [sourceId, setSourceId] = useState(null);
  const location = useLocation();
  const [currentSourceId, setCurrentSourceId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedSourceId, setLastInsertedSourceId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const sourceNameRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.sourceId) {
      setCurrentSourceId(location.state.sourceId);
      fetchSourceData(location.state.sourceId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchSourceData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstSource/RetriveMstSource`, {
        sourceId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const sourceData = response.data.data[0];
        setFormData({
          sourceName: sourceData.sourceName,
          remark: sourceData.remark
        });
        setIsFormDisabled(true);
        setCurrentSourceId(sourceData.sourceId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch source master data');
      }
    } catch (error) {
      console.error('Error fetching source master data:', error);
      toast.error('Error fetching source master data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentSourceId && currentSourceId > 1) {
      await fetchSourceData(currentSourceId, "P");
    }
  };

  const handleNext = async () => {
    if (currentSourceId) {
      await fetchSourceData(currentSourceId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'source') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'source' && value !== '') {
      setTimeout(() => {
        remarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === sourceNameRef.current) {
        remarkRef.current.focus();
      } else {
        remarkRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.sourceName) {
      toast.error('Source name is required');
      setError(prev => ({ ...prev, sourceName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, sourceName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        sourceName: formData.sourceName,
        remark: formData.remark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.sourceId = currentSourceId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}MstSource/UpdateMstSource`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}MstSource/InsertMstSource`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedSourceId(response.data.data)
          console.log(response.data.data)
          await fetchSourceData(response.data.data);
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
          setCurrentSourceId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating Source Master:', error);
      toast.error('Error saving/updating Source Master. Please try again.');
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
      sourceName: '',
      remark: ''
    });
    setCurrentSourceId(null);

    setTimeout(() => {
      sourceNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchSourceData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      sourceName: '',
      remark: ''
    });
    setCurrentSourceId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/sourceMstTable')
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
      await fetchSourceData(currentSourceId, "D");
      await fetchSourceData(currentSourceId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Source Master:', error);
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
                disabled={mode !== 'view' || !currentSourceId || currentSourceId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentSourceId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Source Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentSourceId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentSourceId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentSourceId || currentSourceId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentSourceId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="sourceName"
                  name="sourceName"
                  label={
                    <span>
                      Source <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.sourceName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.sourceName}
                  helperText={error.sourceName && ""}
                  inputRef={sourceNameRef}
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

export default SourceMaster