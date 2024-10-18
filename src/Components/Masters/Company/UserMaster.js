import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Autocomplete
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

const UserMaster = () => {
  const [formData, setFormData] = useState({
    userTypeName: '',
    userName: '',
    pwd: '',
    mobileNo: '',
    emailId: '',
    remark: '',
  });

  const [error, setError] = useState({
    userTypeName: false,
    userName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [utId, setUtId] = useState(null);
  const location = useLocation();
  const [currentUtId, setCurrentUtId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedUtId, setLastInsertedUtId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const userTypeNameRef = useRef(null);
  const userNameRef = useRef(null);
  const pwdRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailIdRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.utId) {
      setCurrentUtId(location.state.utId);
      fetchUserData(location.state.utId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchUserData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmp/RetriveMstEmp`, {
        utId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const userData = response.data.data[0];
        setFormData({
          userTypeName: userData.userTypeName,
          userName: userData.userName,
          pwd: userData.pwd,
          mobileNo: userData.mobileNo,
          emailId: userData.emailId,
          remark: userData.remark,
        });
        setIsFormDisabled(true);
        setCurrentUtId(userData.utId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentUtId && currentUtId > 1) {
      await fetchUserData(currentUtId, "P");
    }
  };

  const handleNext = async () => {
    if (currentUtId) {
      await fetchUserData(currentUtId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'user') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'user' && value !== '') {
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

    if (!formData.userTypeName) {
      toast.error('UserType Name is required');
      setError(prev => ({ ...prev, userTypeName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, userTypeName: false }));
    }

    if (!formData.userName) {
      toast.error('User Name is required');
      setError(prev => ({ ...prev, userName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, userName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        userTypeName: formData.userTypeName,
        userName: formData.userName,
        pwd: formData.pwd,
        mobileNo: formData.mobileNo,
        emailId: formData.emailId,
        remark: formData.remark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.utId = currentUtId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}UserMst/UpdateUserMst`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}UserMst/InsertUserMst`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedUtId(response.data.data)
          console.log(response.data.data)
          await fetchUserData(response.data.data);
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
          setCurrentUtId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating user:', error);
      toast.error('Error saving/updating user. Please try again.');
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
      userTypeName: '',
      userName: '',
      pwd: '',
      mobileNo: '',
      emailId: '',
      remark: ''
    });
    setCurrentUtId(null);

    setTimeout(() => {
      // remarkNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchUserData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      userTypeName: '',
      userName: '',
      pwd: '',
      mobileNo: '',
      emailId: '',
      remark: ''
    });
    setCurrentUtId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/userMasterTable')
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
      await fetchUserData(currentUtId, "D");
      await fetchUserData(currentUtId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting user:', error);
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
                disabled={mode !== 'view' || !currentUtId || currentUtId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentUtId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>User Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentUtId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentUtId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentUtId || currentUtId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentUtId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} className='form_field'>
                <FormControl variant="filled" fullWidth className="custom-select">
                  <InputLabel id="userTypeName-select-label">UserTypeName</InputLabel>
                  <Select
                    labelId="userTypeName-select-label"
                    id="userTypeName-select"
                    name="userTypeName"
                    value={formData.userTypeName}
                    onChange={handleInputChange}
                    className="custom-textfield"
                  >
                    {/* {branch.map((branchName) => ( */}
                    {/* <MenuItem key={empTypeName.id} value={empTypeName.id}>
                        {empTypeName.name}
                      </MenuItem> */}
                    {/* ))} */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="userName"
                  name="userName"
                  label="UserName"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.userName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={userNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="pwd"
                  name="pwd"
                  label="Password"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.pwd}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={remarkRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="mobileNo"
                  name="mobileNo"
                  label="Mobile"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={remarkRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="emailId"
                  name="emailId"
                  label="Email ID"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={remarkRef}
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
                  // inputRef={remarkRef}
                  onKeyDown={handleKeyPress}
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

export default UserMaster