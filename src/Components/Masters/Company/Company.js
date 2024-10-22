import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import StepConnector from "@mui/material/StepConnector";
import StepperMst1 from "./StepperMst1";
import StepperMst2 from "./StepperMst2";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText'; 
import { useNavigate } from "react-router-dom";
const steps = ["Company Details", "Branch Details"];

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: "#e0e0e0",
    borderTopWidth: 3,
    borderRadius: 1,
    margin: "7px 30px 20px 30px",
  },
}));

const CustomStepIcon = styled("div")(({ theme, ownerState }) => ({
  width: 40,
  height: 40,
  border: "3px solid",
  borderColor: ownerState.active ? "#7c3aed" : "#e0e0e0",
  borderRadius: "50%",
  backgroundColor: "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: ownerState.active ? "#7c3aed" : "#999",
  fontSize: "1.2rem",
  fontWeight: "bold",
}));

const CustomStepLabel = styled(StepLabel)({
  flexDirection: "column",
  "& .MuiStepLabel-labelContainer": {
    marginTop: "5px",
  },
});

const Company = () => {
  const location = useLocation();
  const childRef = useRef(null);
  const navigate = useNavigate(); 
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState('');
  const [IsTextFieldDisabled, setTextFieldDisabled] = useState(false);
  const [CompanyData, setCompanyData] = useState([]);
  const [Index, setIndex] = useState(0);
  const [Cities, setCities] = useState([]);
  const [AllTextDisabled, setAllTextDisabled] = useState(false);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(false);
  const [FirstFormData, setFormData] = useState({});
  const [TableData, setTableData] = useState([]);
  const [AllfieldStepperData , setAllfieldStepperData]  = useState({});
  const [CompanyId , setCompanyId] = useState(-1);
  const [openDialog ,setopenDialog] = useState(false);




  useEffect(()=>{
      
  },[Index])

  useEffect(() => {
    const fetch = async () => {
      if (location.state) {
        //function for api call ...
        let companyId = location.state.companyId;
        setCompanyId(companyId);
        await fetchCompanyData(companyId);
        let flag = "R";
        await fetchBranchData(companyId, flag);

        setMode("view");
        viewModeDis();
      } else {
        setMode("add");
        addModeDis();
      }
      await fetchCities();
    };

    fetch();
  }, []);



  const viewModeDis = () => {
    setAllTextDisabled(true);
    setAllButtonDisabled(false);
  };

  const addModeDis = () => {
    setAllTextDisabled(false);
    setAllButtonDisabled(true);
  };
  
  

const handleCancel =()=>{
 setopenDialog(false);
} 

  const fetchCities = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}PincodeMst/getcitydrp`
    );
    setCities(response.data.data);
  };

  const fetchCompanyData = async (companyId,flag) => {
    let allcompanyData = await axios.post(
      `${process.env.REACT_APP_API_URL}coMst/RetriveCoMst`,
      {
        CoMstId:companyId,
        Flag:flag
      } 
     
    ); 
   
   
    
    setCompanyData(allcompanyData.data.data.CoMstList);
    setCompanyId(allcompanyData.data.data.CoMstList[0].CoMstId);
    console.log("Company-data",allcompanyData.data.data.CoMstList);
  };

  const fetchBranchData = async (companyId, flag) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}coMst/RetriveCoMst`,
        {
          CoMstId: parseInt(companyId),
          Flag: flag,
        }
      );
      let companyBranchdata = response.data.data.CoMstList[0].CobrMstList;
      console.log("table-data",companyBranchdata);
      setTableData(companyBranchdata);
    } catch (error) {
      console.log("error");
    }
  };

  const handleAdd = () => {
    addModeDis();
    setMode("add");
  };

  const handlePrevClick = () => {
    // if (Index > 0) {
    //   setIndex((prev) => prev - 1);
    // }
    fetchCompanyData(CompanyId , "P");
    
     
  };

  const handleNextClick = () => {
    // if (Index < CompanyData.length - 1) {
    //   setIndex((prev) => prev + 1);
    // }
    fetchCompanyData(CompanyId , "N");
  };

  const handleEdit = () => {
    addModeDis();
    setMode("view");
  };

  const stepToNext = (obj) => {
    console.log("mode",mode);
     setAllfieldStepperData(obj);
     console.log("backform obj",obj)
    if(mode === "add"){
      let newObj ={};
      let newTableData = [];
       newObj.CobrMstId = 0;
       newObj.CobrAdd = obj.CoRegAdd;
       newObj.MainBranch = "1";
       newObj.CobrName = obj.CoName;
       newObj.CobrAbrv = obj.CoAbrv;
       newObj.GSTIN = obj.GSTIN;
       newObj.CobrEmail = obj.CoEmail;
       newObj.PinID = parseInt(obj.PinID);
       newObj.CityId = parseInt(obj.CityId);
       newObj.DBFLAG = "I";
       newObj.Status = "1";
       newObj.MainBranch = "1";
       newObj.CobrTel = obj.CoTel;
       newObj.Website = obj.Website;
       newObj.IeCode = obj.IeCode;
       newObj.MsmeNo = obj.MsmeNo;
       newObj.MsmeCat = obj.MsmeCat;
       newObj.MsmeType = obj.MsmeType ;
       newObj.Remark2 = obj.Remark2;
       newObj.Remark1 = obj.Remark1;
       newObj.CobrMob = obj.CoMob;


      newTableData.push(newObj);
      console.log("new Table Data",newTableData);
      setTableData(newTableData);
      }else{


    }
    setActiveStep(1);
   
  };

  const handleDelete = async() => { 
    setopenDialog(true);
    };

  const handleConfirmDelete = async()=>{
    console.log("delete");
    console.log("CompanyId",CompanyId);
    let response = await axios.post(
     `${process.env.REACT_APP_API_URL}coMst/RetriveCoMst`,
     {
       CoMstId: String(CompanyId),
       Flag:"D"
       }
 
   );
   toast.success(response.data.message);
   setopenDialog(false);
   handleAdd();
   setTimeout(()=>{
    navigate(`/masters/companytable`);
   },2000);
} 


  const handleMoveBack = ()=>{
    navigate(`/masters/companytable`);
  }

  const handleStepClick = (step) => {
    console.log("step ");
    if (mode === "view") {
      setActiveStep(step);
}
  };

  return (
    <Grid>
      <Box className="form-container"> 
      <ToastContainer />
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
        <Grid container spacing={2} className="rasidant_grid">
          {/* Header Section */}
          <Grid
            item
            xs={12}
            className="form_title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: activeStep == 0 && "space-between",
              gap: activeStep === 1 && "25vw",
              marginTop: "20px",
            }}
          >
            {activeStep != 1 &&  (
                <Grid>
                {/* Previous Button */}
                
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#635BFF" }}
                  className="three-d-button-previous"
                  disabled={AllButtonDisabled}
                  onClick={handlePrevClick}
                >
                  <KeyboardArrowLeftIcon />
                </Button>
                {/* Next Button */}
                <Button
                  variant="contained"
                  size="small"
                  className="three-d-button-next"
                  sx={{ backgroundColor: "#635BFF", margin: "0px 10px" }}
                  disabled={AllButtonDisabled}
                  onClick={handleNextClick}
                >
                  <NavigateNextIcon />
                </Button>
              </Grid>
            ) }
          
            <Typography variant="h5" sx={{margin : "Auto" }}>
              Company Master
            </Typography>
            {activeStep != 1 && (
              <Grid sx={{ display: "flex", justifyContent: "end" }}>
                {/* Add, Edit, Delete, Cancel Buttons */}
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#7c3aed" }}
                  onClick={handleAdd}
                  disabled={AllButtonDisabled}
                >
                  <AddIcon />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
                  disabled={AllButtonDisabled}
                  onClick={handleEdit}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#7c3aed" }}
                  disabled={AllButtonDisabled}
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
                  disabled={AllButtonDisabled}
                  onClick={handleMoveBack} 
                >
                  <CancelPresentationIcon />
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Stepper Section */}
          <Grid item xs={12}>
            <Stepper
              activeStep={activeStep}
              connector={<CustomStepConnector />}
              alternativeLabel
            >
              {steps.map((label, index) => (
                <Step
                  key={label}
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: mode === "view" ? "pointer" : "default" }}
                >
                  <CustomStepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon
                        ownerState={{ ...props, active: activeStep === index }}
                      >
                        {index + 1}
                      </CustomStepIcon>
                    )}
                  >
                    {label}
                  </CustomStepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          {/* Content Based on Active Step */}
          <Grid item xs={12}>
            {activeStep === 0 ? (
              <StepperMst1
                index={Index}
                mode={mode}
                CompanyData={CompanyData}
                Cities={Cities}
                AllTextDisabled={AllTextDisabled}
                AllButtonDisabled={AllTextDisabled}
                viewModeDis={viewModeDis}
                addModeDis={addModeDis}
                stepToNext={stepToNext}
                setMode={setMode}
              />
            ) : (
              <StepperMst2
               TableData={TableData} 
               mode={mode}
               Cities={Cities}
               setTableData={setTableData}
               AllfieldStepperData  ={AllfieldStepperData}
               CompanyId = {CompanyId}
               ref={childRef}
               setActiveStep={setActiveStep}
               fetchCompanyData = {fetchCompanyData}
               />
            )}
          </Grid>

          {/* Buttons for form actions */}
        </Grid>
      </Box>
    </Grid>
  );
};

export default Company;
