import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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
import { InstituteAutocomplete } from '../../../Components/AutoComplete/AutoComplete'

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

const CourseMaster = () => {
  const [formData, setFormData] = useState({
    instituteName: '',
    courseName: '',
    coursePeriod: '',
    remark: ''
  });

  const [error, setError] = useState({
    instituteName: false,
    courseName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [courseId, setCourseId] = useState(null);
  const location = useLocation();
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedCourseId, setLastInsertedCourseId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const instituteNameRef = useRef(null);
  const courseNameRef = useRef(null);
  const coursePeriodRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.courseId) {
      setCurrentCourseId(location.state.courseId);
      fetchCourseData(location.state.courseId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchCourseData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstCourse/RetriveMstCourse`, { 
        courseId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const courseData = response.data.data[0];
        setFormData({
          instituteName: courseData.instituteId.toString(),
          courseName: courseData.courseName, 
          coursePeriod: courseData.coursePeriod,
          remark: courseData.remark
        });
        setIsFormDisabled(true);
        setCurrentCourseId(courseData.courseId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch course master data');
      }
    } catch (error) {
      console.error('Error fetching course master data:', error);
      toast.error('Error fetching course master data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}MstInstitute/getMstInstitutedrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setInstitutes(response.data.data);
        } else {
          toast.error('Failed to fetch Institutes');
        }
      } catch (error) {
        console.error('Error fetching Institutes:', error);
        toast.error('Error fetching Institutes. Please try again.');
      }
    };

    fetchInstitutes();
  }, []);

  const handlePrevious = async () => {
    if (currentCourseId && currentCourseId > 1) {
      await fetchCourseData(currentCourseId, "P");
    }
  };

  const handleNext = async () => {
    if (currentCourseId) {
      await fetchCourseData(currentCourseId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

  if (name === 'course') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'course' && value !== '') {
    setTimeout(() => {
      remarkRef.current.focus();
    }, 100000);
  }
};

// something changes

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === instituteNameRef.current) {
      courseNameRef.current.focus();
    } else if (event.target === courseNameRef.current){
      coursePeriodRef.current.focus();
    } else {
      remarkRef.current.focus();
    }
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.instituteName) {
    toast.error('Institute Name is required');
    setError(prev => ({ ...prev, instituteName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, instituteName: false }));
  }

  if (!formData.courseName) {
    toast.error('Course Name is required');
    setError(prev => ({ ...prev, courseName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, courseName: false }));
  }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      instituteId: parseInt(formData.instituteName),
      courseName: formData.courseName,
      coursePeriod: formData.coursePeriod,
      remark: formData.remark,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.courseId = currentCourseId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}MstCourse/UpdateMstCourse`, payload);
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}MstCourse/InsertMstCourse`, payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedCourseId(response.data.data)
        console.log(response.data.data)
        await fetchCourseData(response.data.data);
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
        setCurrentCourseId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating Course Master:', error);
    toast.error('Error saving/updating Course Master. Please try again.');
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
      courseName: '',
      coursePeriod: '',
      remark: ''
    });
    setCurrentCourseId(null);

    setTimeout(() => {
      instituteNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchCourseData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      instituteName: '',
      courseName: '',
      coursePeriod: '',
      remark: ''
    });
    setCurrentCourseId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/coursetable')
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
      await fetchCourseData(currentCourseId, "D");
      await fetchCourseData(currentCourseId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Course Master:', error);
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
            disabled={mode !== 'view' || !currentCourseId || currentCourseId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentCourseId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3>Course Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentCourseId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentCourseId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentCourseId || currentCourseId === 1}
          >
            <DeleteIcon />
          </Button>
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentCourseId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6} className='form_field'>
            {/* <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="instituteName-select-label">InstituteName</InputLabel>
              <Select
                labelId="instituteName-select-label"
                id="instituteName-select"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleInputChange}
                className="custom-textfield"
                disabled={isFormDisabled}
              >
                {institutes.map((instituteName) => (
                  <MenuItem key={instituteName.id} value={instituteName.id}>
                    {instituteName.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <InstituteAutocomplete
              institutes={institutes}
              value={institutes.find(instituteName => instituteName.id == formData.instituteName) || null}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.instituteName}
              helperText={error.instituteName ? '' : ''}
              ref={instituteNameRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="courseName"
               name="courseName"
               label={
                <span>
                  Course <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.courseName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.courseName}
               helperText={error.courseName && ""}
               inputRef={courseNameRef}
               onKeyDown={handleKeyPress}
              />
             </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="coursePeriod"
                  name="coursePeriod"
                  label="Course Period"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.coursePeriod}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={coursePeriodRef}
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

export default CourseMaster