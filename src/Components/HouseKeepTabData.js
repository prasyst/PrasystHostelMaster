import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"
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
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';



const HouseKeepTabData = () => { 
  const {register , setValue , watch  , reset} = useForm();
  const navigate = useNavigate();
  
    const [AllInputTextDisabled , setAllInputTextDisabled] = useState(true);
    const [AllData , setAllData] = useState([]);
    const paramId = useParams('id');
    console.log(paramId.id);
    const [index , setIndex] = useState(0);
    const [isEdit , setIsEdit] = useState(false);
    const [AllButtonDisabled , setAllButtonDisabled] = useState(false);
    const [openDialog ,setopenDialog] = useState(false);
    const [ DataChangeFlag ,setDataChangeFlag] = useState(false);
    const textFieldRef = useRef(null);

   
    useEffect(() => {
      if (!AllInputTextDisabled && textFieldRef.current) {
        textFieldRef.current.focus();
      }
    }, [AllInputTextDisabled])

  

   


    useEffect(() => {
        axios.post(`${process.env.REACT_APP_API_URL}MstHkType/getAllMstHkTypeDashBoard`, {
          start: 0,
          PageSize: 0,
          SearchText: ""
        })
        .then((res) => {
          let arr = res.data.data;
          let newdata = arr.map(({ hkTypeName, abrv, remark,hkTypeId }) => ({
            name: hkTypeName,
            shortname: abrv,
            remark: remark,
            id : hkTypeId,
          }));
          setAllData(newdata);
          console.log("arr",newdata);

          console.log("paramId.id",paramId.id);
        
          if(paramId.id != undefined){ 
            let pid = parseInt(paramId.id);
              let getobj = arr.find((obj) => obj.hkTypeId ===pid);
              console.log("getobj",getobj);
              setValue('hkTypeName',getobj['hkTypeName']);
              setValue('abrv',getobj['abrv']);
              setValue('remark',getobj['remark']);
              let findIndex = newdata.findIndex(obj => obj.id === pid);
              
              setIndex(findIndex);
          }else{
              setAllButtonDisabled(true);
              setAllInputTextDisabled(false);
              setIsEdit(false);
          }
        
       
        })
        .catch((err) => {
          console.log(err);
        });
      },[DataChangeFlag]);


   

  

  const handleClick = () => {
    setopenDialog(true);
  };

 

   
    const settingValue = (ind)=>{
      setValue('hkTypeName',AllData[ind]['name']);
      setValue('abrv',AllData[ind]['shortname']);
      setValue('remark',AllData[ind]['remark']);
    }  


     const resetFunc = ()=>{
         reset({ 
           'hkTypeName':'',
           'abrv' : '',
           'remark' : ''
         })
     }


      
    // const handleAddButtonClick = ()=>{
    //     setAllInputTextDisabled(false); 
    //     resetFunc();
    //     setAllButtonDisabled(true);
    //     setIsEdit(false);
    //     setTimeout(()=>{
    //       nameRef.current.focus(); 
    //     },0)

    //   }

    const handleAddButtonClick = () => {
      setAllInputTextDisabled(false); 
      resetFunc();
      setAllButtonDisabled(true);
      setIsEdit(false);
      moveToInput();
    
    }

    const moveToInput = () => {
      const inputElement = document.getElementById('myInput');
      if (inputElement) {
        inputElement.focus();
      }
    };

     const  handleEditButtonClick = ()=>{
       setAllInputTextDisabled(false); 
       setAllButtonDisabled(true);
       setIsEdit(true);
  }

     

      const handleClickPrev = ()=>{
         if(index > 0){
            setIndex(prev => prev - 1);
          
            settingValue(index - 1);
            // setValue('hkTypeName',AllData[index - 1]['name']);
            // setValue('abrv',AllData[index - 1]['shortname']);
            // setValue('remark',AllData[index - 1]['remark']);
           
            
         }else{
       
         }
      } 

      const handleClickNext = ()=>{
           if(index < AllData.length - 1){
            setIndex(prev => prev + 1);
            settingValue(index + 1);
           }else{
          
           }
      } 
      

      const handleCancelButtonClick =()=>{
        console.log("click");
            setAllButtonDisabled(false);
            setAllInputTextDisabled(true);
            if(paramId.id != undefined){ 
               let pid = parseInt(paramId.id);
               console.log("cancel" ,AllData);
                let getobj = AllData.find((obj) => obj.id === pid);
               console.log("obj" ,getobj);
                console.log("getobj",getobj);
                setValue('hkTypeName',getobj['name']);
                setValue('abrv',getobj['shortname']);
                setValue('remark',getobj['remark']);
                let findIndex = AllData.findIndex(obj => obj.id === pid);
                setIndex(findIndex);
            }else{
              
            }

      } 

      const handleClickNavigateBack =()=>{
          navigate(`/HouseKeepingTable`);
      }


      
   

    const insertData = () =>{
      let sendObjectData = watch();

      if(sendObjectData.hkTypeName === ""){
        console.log("not inserted")
           toast.error("Name is required ");
           return;
          }
         sendObjectData.Status = "1";
         sendObjectData.CreatedBy = 1;
          console.log("insert sendObjectData",sendObjectData);

      axios.post(`${process.env.REACT_APP_API_URL}MstHkType/InsertMstHkType`, sendObjectData)
      .then((res)=>{
          console.log("res",res); 
          res.data.data === "" ?  toast.error(res.data.message) : toast.success(res.data.message);
           setAllInputTextDisabled(true);
           setAllButtonDisabled(false);
           setDataChangeFlag(prev => !prev);
          

          })
      .catch((err)=>{
         console.log(err);
      })
     
    };


    const  updateData = ()=>{
      let sendObjectData = watch();
      sendObjectData.HkTypeId = AllData[index].id
      sendObjectData.Status = "1";
      sendObjectData.UpdatedBy= 1; //check
      axios.post(`${process.env.REACT_APP_API_URL}MstHkType/UpdateMstHkType`, sendObjectData)
      .then((res)=>{
          console.log("res",res);
          res.data.data === "" ?  toast.error(res.data.message) : toast.success(res.data.message);
          setAllInputTextDisabled(true);
          setAllButtonDisabled(false);
          setDataChangeFlag(prev => !prev);
            


      })
      .catch((err)=>{
         console.log(err);
      })

    }

      const onSubmit = ()=>{
          if(!isEdit){
              insertData();
          }else{
              updateData();
          }
        

      } 

      const handleCancel = ()=>{
        setopenDialog(false);
      }

      const handleConfirmDelete = ()=>{
           console.log("delete");
           let HkTypeId = AllData[index].id;
           let Flag = "D";
           let sendObjectData ={HkTypeId,Flag};
           console.log(sendObjectData);
           axios.post(`${process.env.REACT_APP_API_URL}MstHkType/RetriveMstHkType`, sendObjectData)
           .then((res)=>{
               console.log("res",res);
               if(res.statusText === "OK"){
                toast.success(res.data.message);
                }
               setopenDialog(false);
               resetFunc();
               let ind = 1;
               if(index === 0){
              
                settingValue(ind);
               }else{ 
                  ind = index - 1;
                  settingValue(ind);
                }
                 console.log("index" ,ind);
                  setIndex(ind);
                  setDataChangeFlag(prev => !prev);
            
              

     
           })
           .catch((err)=>{
              console.log(err);
           })
      }

   
       


  return (
    <>

    <Box className="form-container">
{/*    
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog> */}




        <Dialog
          open={openDialog}
          onClose={handleCancel}
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
              onClick={handleCancel}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>






    <ToastContainer />
      <Grid container spacing={2} className='form_grid'>
      <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', marginTop: '20px' }}>
        <Grid>
        <Button 
          variant="contained" 
          size="small" 
          className='three-d-button-previous'
           onClick = {handleClickPrev}
           disabled={AllButtonDisabled}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        
        <Button 
          variant="contained" 
          size="small" 
          sx={{ margin:'0px 10px' }}  
          className='three-d-button-next'    
          disabled={AllButtonDisabled}
           onClick = {handleClickNext}
        >
           <NavigateNextIcon />
        </Button>
        </Grid>
        <h3>House Keeping Type Master</h3>
        <Grid sx={{display:'flex', justifyContent:'end'}}>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ backgroundColor: '#7c3aed'}}     
          onClick={handleAddButtonClick}
          disabled={AllButtonDisabled}

        >
           <AddIcon />
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
          disabled={AllButtonDisabled}
          onClick={handleEditButtonClick}
        >
           <EditIcon />
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ backgroundColor: '#7c3aed' }} 
          disabled={AllButtonDisabled}
          onClick={handleClick}
        >
          <DeleteIcon />
        </Button>

        <Button 
          variant="contained" 
          size="small" 
          sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
          disabled={AllButtonDisabled}
          onClick={handleClickNavigateBack}
        >
           <CancelPresentationIcon />
        </Button>
        </Grid>
      </Grid>
   
        <Grid item xs={12} className='form_field'>
          <Grid container spacing={2}> 
           
           <Grid item xs={12} md={8} lg={8}>
            <TextField
             id="name"
             name="name"
             label={
              <span>
                 Name <span style={{ color: 'red' }}>*</span>
              </span>
             }
             variant="filled"
             fullWidth
             className="custom-textfield"  
             disabled = {AllInputTextDisabled}
             {...register('hkTypeName')}
             inputRef={textFieldRef} 
            />
        </Grid>
           
           <Grid item xs={12} md={8} lg={8}>
            <TextField
             id="shortname"
             name="shortname "
             label={
              <span>
              ShortName
              </span>
             }
             variant="filled"
             fullWidth
             className="custom-textfield"
             disabled = {AllInputTextDisabled}
             {...register('abrv')}
            />
           </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <TextField
                id="remark"
                name="remark"
                label={
                  <span>
                    Remarks
                  </span>
                 }
                variant="filled"
                fullWidth
                className="custom-textfield"
                disabled = {AllInputTextDisabled}
                {...register('remark')}
             
              />
            </Grid>
          </Grid>
        </Grid>

      <Grid item xs={12} className="form_button">
       
          
      
      
       
         
          <Button variant="contained" sx={{ mr: 1 }} onClick={onSubmit} disabled = {AllInputTextDisabled} style={{ background  :AllInputTextDisabled  && 'linear-gradient(290deg, #d4d4d4, #ffffff)' }}  >
             {!isEdit ? "Submit" : "Update"}
                             
            </Button>
            <Button variant="contained" sx={{ mr: 1 }} disabled = {AllInputTextDisabled} onClick={handleCancelButtonClick}  style={{ background  :AllInputTextDisabled  && 'linear-gradient(290deg, #d4d4d4, #ffffff)' }}>
              Cancel
            </Button>
           
         
      
      </Grid>
      </Grid>
    </Box>
    

 
    
  </>
  )
}

export default HouseKeepTabData
