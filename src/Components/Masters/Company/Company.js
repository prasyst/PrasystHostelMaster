import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Button, TextField, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon
} from '@mui/icons-material';
import '../../../index.css'
import { FormLabel, RadioGroup, FormControlLabel, Radio, StepConnector } from '@mui/material';
// here is updated code 
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ConfirmDialog } from '../../ReusablePopup/CustomModel';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const steps = ['Company Details', 'Branch Details'];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
    borderRadius: 1,
    margin: '7px 30px 20px 30px'
  },
}));
const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
  width: 40,
  height: 40,
  border: '3px solid',
  borderColor: ownerState.active ? '#7c3aed' : '#e0e0e0',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: ownerState.active ? '#7c3aed' : '#999',
  fontSize: '1.2rem',
  fontWeight: 'bold',
}));

const CustomStepLabel = styled(StepLabel)({
  flexDirection: 'column',
  '& .MuiStepLabel-labelContainer': {
    marginTop: '5px',
  },
});
const Company = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [rows, setRows] = useState([]);
  const [mode, setMode] = useState('view');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [companyId, setCompanyId] = useState()
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(true);
  const [isConfirmCancelEnabled, setIsConfirmCancelEnabled] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isMainBranchSelected, setIsMainBranchSelected] = useState(false);
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [isBranchEditDeleteEnabled, setIsBranchEditDeleteEnabled] = useState(false);
 
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(null);


  const handleAddClick = () => {
    setIsAdding(true); 
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };
  const [formData, setFormData] = useState({
    companyName: '',
    CoAbrv: '',
    gstNo: '',
    CityId: '',
    CoRegAdd: '',
    CoPan: '',
    CoTan: '',
    CoCin: '',
    CoEmail: '',
    CoTel: '',
    CoMob: '',
    website: '',
    ieCode: '',
    tdsCircle: '',
    tdsPerson: '',
    designation: '',
    msmeNo: '',
    msmeCat: '',
    msmeType: '',
    PinID: '',
    remark1: '',
    remark2: '',
    workAddress: '',
    
  });
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState({
    branchCode: '',
    branchName: '',
    shortName: '',
    gstNo: '',
    jurisdiction: '',
    branchAddress: '',
    emailID: '',
    telNo: '',
    website: '',
    ieCode: '',
    msmeNo: '',
    msmeCat: '',
    msmeType: '',
    pinCode: '',
    remark1: '',
    remark2: '',
    bankDetails1: '',
    bankDetails2: '',
  });

  const navigate = useNavigate()
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const fetchCompanyData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}coMst/RetriveCoMst`, {
        CoMstId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const company = response.data.data.CoMstList[0];
        const branches = response.data.data.CoMstList[0].CobrMstList;
        console.log('com',company)
        console.log('br',branches)
        setFormData({
          CoMstId: company.CoMstId,
          companyCode: company.CoMstId,
          companyName: company.CoName,
          shortName: company.CoAbrv,
          gstNo: company.GSTIN,
          jurisdiction: company.CityId,
          regAddress: company.CoRegAdd,
          panN: company.CoPan,
          tanNo: company.CoTan,
          cinNo: company.CoCin,
          emailID: company.CoEmail,
          telNo: company.CoTel,
          CoMob: company.CoMob,
          website: company.Website,
          ieCode: company.IeCode,
          tdsCircle: company.TdsCircle,
          tdsPerson: company.TdsPerson,
          designation: company.Designation,
          msmeNo: company.MsmeNo,
          msmeCat: company.MsmeCat,
          msmeType: company.MsmeType,
          pinCode: company.PinID,
          remark1: company.Remark1,
          remark2: company.Remark2,
          workAddress: company.WorkAddr,
        })
       
        setBranches(branches.map((branch) => ({
          branchCode: branch.CobrMstId,
          companyName: company.CoName, 
          branchName: branch.CobrName,
          shortName: branch.CobrAbrv,
          gstNo: branch.GSTIN,
          jurisdiction: branch.CityId,
          cityId: branch.CityId,
          branchAddress: branch.CobrAdd,
          emailID: branch.CobrEmail,
          branchTel: branch.CobrTel,
          branchMobile: branch.CobrMob,
          website: branch.Website,
          ieCode: branch.IeCode,
          msmeNo: branch.MsmeNo,
          msmeCat: branch.MsmeCat,
          msmeType: branch.MsmeType,
          pinCode: branch.pinID,
          remark1: branch.Remark1,
          remark2: branch.Remark2,
          status: branch.Status,
          dbFlag: branch.DBFLAG,
          telNo: branch.CobrTel
        })));
        setTableData(branches.map((branch) => ({
          branchCode: branch.CobrMstId,
          companyName: company.CoName,
          branchName: branch.CobrName,
          gstNo: branch.GSTIN,
          pinCode: branch.PinID,
          branchAddress: branch.CobrAdd,
          state: 'N/A' 
        })));
        const mainBranch = branches.find(branch => branch.MainBranch === "0") || branches[0];
      setCurrentBranch({
        branchCode: mainBranch.CobrMstId,
        branchName: mainBranch.CobrName,
        shortName: mainBranch.CobrAbrv,
        gstNo: mainBranch.GSTIN,
        jurisdiction: mainBranch.CityId,
        branchAddress: mainBranch.CobrAdd,
        emailID: mainBranch.CobrEmail,
        telNo: mainBranch.CobrTel,
        website: mainBranch.Website,
        ieCode: mainBranch.IeCode,
        msmeNo: mainBranch.MsmeNo,
        msmeCat: mainBranch.MsmeCat,
        msmeType: mainBranch.MsmeType,
        pinCode: mainBranch.PinID,
        remark1: mainBranch.Remark1,
        remark2: mainBranch.Remark2,
      });
        setIsFormDisabled(true);
        console.log('CobrName',branches)
        setCompanyId(company.CoMstId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch city data');
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
      toast.error('Error fetching city data. Please try again.');
    }
  };
  const handleBranchEdit = () => {
    if (selectedBranch && !isMainBranchSelected) {
      setMode('edit');
      setIsFormDisabled(false);
      setCurrentBranch(selectedBranch);
      setIsEditingBranch(true);
      setIsConfirmEnabled(true);
      setIsAddButtonEnabled(false);
      setIsConfirmCancelEnabled(true);
    }
  };
  const handleBranchInputChangeNew = (e) => {
    const { name, value } = e.target;
    setCurrentBranch(prev => ({ ...prev, [name]: value }));
  };
  const handleClickNext = async () => {
    if (companyId) {
      await fetchCompanyData(companyId, "N");
    }
  }
  const handleCliclPrivious = async () => {
    if (companyId && companyId > 1) {
      await fetchCompanyData(companyId, "P");
    }
  }

  useEffect(() => {
    if (location.state && location.state.companyId) {
      setCompanyId(location.state.companyId);
      fetchCompanyData(location.state.companyId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const handleNext = () => {
    if (activeStep === 0) {  
      const companyBranch = {
        branchCode: formData.companyCode || '',
        companyName: formData.companyName,
        branchName: formData.companyName, 
        gstNo: formData.gstNo,
        PinCode: formData.pinCode,
        branchAddress: formData.regAddress,
        state: '', 
      };
      // setTableData(branches);
      // const mainBranch = branches.find(branch => branch.branchCode === formData.companyCode);
      // setSelectedBranch(mainBranch);
      // setIsMainBranchSelected(true);
       setTableData([companyBranch]);
      setBranches([companyBranch]);
      console.log('company',companyBranch)
      setSelectedBranch(companyBranch);
      setIsMainBranchSelected(true);
      setIsAddButtonEnabled(true);
      setIsConfirmCancelEnabled(false);
    }

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBranchAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
    setCurrentBranch({
      branchCode: '',
      branchName: '',
      shortName: '',
      gstNo: '',
      jurisdiction: '',
      branchAddress: '',
      emailID: '',
      telNo: '',
      website: '',
      ieCode: '',
      msmeNo: '',
      msmeCat: '',
      msmeType: '',
      pinCode: '',
      remark1: '',
      remark2: '',
      bankDetails1: '',
      bankDetails2: '',
    });
    setSelectedBranch(null);
    setIsMainBranchSelected(false);
    setIsAddingBranch(true);
    setIsConfirmEnabled(true);
    setIsEditingBranch(false);
    
    // Enable only Confirm and Cancel buttons
    setIsAddButtonEnabled(false);
    setIsConfirmCancelEnabled(true);
  };
  const handleSubmit = async () => {
    let payload;
  
    const companyData = {
      DBFLAG: companyId ? "U" : "I",
      CoMstId: companyId || 0,
      CoName: formData.companyName,
      CoAbrv: formData.shortName,
      GSTIN: formData.gstNo,
      CityId: parseInt(formData.jurisdiction) || 1,
      CoRegAdd: formData.regAddress || "",
      CoPan: formData.panN || "",
      CoTan: formData.tanNo || "",
      CoCin: formData.cinNo || "",
      CoEmail: formData.emailID || "",
      CoTel: formData.telNo || "",
      CoMob: formData.CoMob || "",
      Website: formData.website || "",
      IeCode: formData.ieCode || "",
      TdsCircle: formData.tdsCircle || "",
      TdsPerson: formData.tdsPerson || "",
      Designation: formData.designation || "",
      MsmeNo: formData.msmeNo || "",
      MsmeCat: formData.msmeCat || "",
      MsmeType: formData.msmeType || "",
      PinID: formData.pinCode || "",
      Remark1: formData.remark1 || "",
      Remark2: formData.remark2 || "",
      WorkAddr: formData.workAddress || "",
      Status: formData.Status || "1",
    };
  
    const branchesData = branches.map((branch) => ({
      DBFLAG: branch.branchCode ? "U" : "I",
      CobrMstId: branch.branchCode || 0,
      CobrName: branch.branchName,
      CobrAbrv: branch.shortName,
      GSTIN: branch.gstNo,
      CityId: parseInt(branch.jurisdiction) || 1,
      CobrAdd: branch.branchAddress,
      CobrEmail: branch.emailID,
      CobrTel: branch.telNo,
      CobrMob: branch.CoMob || "",
      Website: branch.website,
      IeCode: branch.ieCode,
      MsmeNo: branch.msmeNo,
      MsmeCat: branch.msmeCat,
      MsmeType: branch.msmeType,
      PinID: branch.pinCode,
      Remark1: branch.remark1,
      Remark2: branch.remark2,
      Status: branch.Status || "1",
      MainBranch: branch.branchCode === formData.companyCode ? "1" : "0",
    }));
  
    payload = {
      ...companyData,
      cobrMstList: branchesData,
    };
  
    console.log("submissionData", payload);
    let jsonData = JSON.stringify(payload).replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
    jsonData = '"' + jsonData + '"';
    console.log("jsonData", jsonData);
  
    try {
      const response = await axios.post(
        'http://43.230.196.21/api/CoMst/ManageCompanyBranch',
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Submission successful:', response.data);
      toast.success(response.data.message);
  
      if (isEditing) {
        setIsEditing(false);
        setMode('view');
        setIsFormDisabled(true);
        fetchCompanyData(companyId);
      } else {
        // Handle the case for a new company
        if (response.data.data && response.data.data.CoMstId) {
          setCompanyId(response.data.data.CoMstId);
        }
        setMode('view');
        setIsFormDisabled(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    }
  };
  // const handleSubmit = async () => {
    
  //   if (isEditing) {
  //     const payload = {
  //       comstid: companyId,
  //       CoName: formData.companyName,
  //       CoAbrv: formData.shortName,
  //       GSTIN: formData.gstNo,
  //       CityId: parseInt(formData.jurisdiction) || 1,
        
  //     };

  //     try {
  //       const response = await axios.post('http://43.230.196.21/api/CoMst_Cobr/UpdateCoMst_CobrMst', payload);
  //       if (response.data.status === 0 && response.data.responseStatusCode === 1) {
  //         toast.success('Company data updated successfully');
  //         setIsEditing(false);
  //         setMode('view');
  //         setIsFormDisabled(true);
  //         // Optionally, refresh the data after update
  //         fetchCompanyData(companyId);
  //       } else {
  //         toast.error(response.data.message || 'Failed to update company data');
  //       }
  //     } catch (error) {
  //       console.error('Error updating company data:', error);
  //       toast.error('Error updating company data. Please try again.');
  //     }
  //   } else {
  //     const companyData = {
  //       DBFLAG: "I",
  //       MainBranch:'1',
  //       CoName: formData.companyName,
  //       CoAbrv: formData.shortName,
  //       GSTIN: formData.gstNo,
  //       CityId: parseInt(formData.jurisdiction) || 1,
  //       CoRegAdd: formData.regAddress || "",
  //       CoPan: formData.panN || "",
  //       CoTan: formData.tanNo || "",
  //       CoCin: formData.cinNo || "",
  //       CoEmail: formData.emailID || "",
  //       CoTel: formData.telNo || "",
  //       CoMob: formData.CoMob || "",
  //       Website: formData.website || "",
  //       IeCode: formData.ieCode || "",
  //       TdsCircle: formData.tdsCircle || "",
  //       TdsPerson: formData.tdsPerson || "",
  //       Designation: formData.designation || "",
  //       MsmeNo: formData.msmeNo || "",
  //       MsmeCat: formData.msmeCat || "",
  //       MsmeType: formData.msmeType || "",
  //       PinID: formData.pinCode || "",
  //       Remark1: formData.remark1 || "",
  //       Remark2: formData.remark2 || "",
  //       WorkAddr: formData.workAddress || "",
  //       Status: formData.Status || "1",
  //     };
    
  //     const mainBranchData = {
  //       DBFLAG: "I",
  //       CobrName: formData.companyName ,
  //       CobrAbrv: formData.shortName,
  //       GSTIN: formData.gstNo,
  //       CityId: parseInt(formData.jurisdiction) || 1,
  //       CobrAdd: formData.regAddress,
  //       CobrEmail: formData.emailID,
  //       CobrTel: formData.telNo,
  //       CobrMob: formData.CoMob || '',
  //       Website: formData.website,
  //       IeCode: formData.ieCode,
  //       MsmeNo: formData.msmeNo,
  //       MsmeCat: formData.msmeCat,
  //       MsmeType: formData.msmeType,
  //       PinID: formData.pinCode,
  //       Remark1: formData.remark1,
  //       Remark2: formData.remark2,
  //       Status: "1",
  //       MainBranch: "0"  
  //     };
  
  //     // Prepare other branches data
  //     const otherBranchesData = branches.slice(1).map(branch => ({
  //       DBFLAG: "I",
  //       CobrName: branch.branchName,
  //       CobrAbrv: branch.shortName,
  //       GSTIN: branch.gstNo,
  //       CityId: parseInt(branch.jurisdiction) || 1,
  //       CobrAdd: branch.branchAddress,
  //       CobrEmail: branch.emailID,
  //       CobrTel: branch.telNo,
  //       CobrMob: branch.CoMob || '',
  //       Website: branch.website,
  //       IeCode: branch.ieCode,
  //       MsmeNo: branch.msmeNo,
  //       MsmeCat: branch.msmeCat,
  //       MsmeType: branch.msmeType,
  //       PinID: branch.pinCode,
  //       Remark1: branch.remark1,
  //       Remark2: branch.remark2,
  //       Status: branch.Status || "1",
  //       MainBranch: "1" 
  //     }));
  //  console.log('co',companyData)
  //  console.log('cobr',[mainBranchData,...otherBranchesData])
  //     const payload = {
  //       ...companyData,
  //       cobrMstList: [mainBranchData, ...otherBranchesData]
  //     };
    
  //     // const payload = {
  //     //   ...companyData,
  //     //   cobrMstList: branchData
  //     // };
  //     console.log('submissionData', payload)
  //     let jsonData = JSON.stringify(payload)
  //       .replace(/\\/g, '\\\\')
  //       .replace(/\"/g, '\\"');
  
  //     jsonData = '"' + jsonData + '"';
  //     console.log('jsonData', jsonData)
  //     try {
  //       const response = await axios.post('http://43.230.196.21/api/CoMst/ManageCompanyBranch', jsonData, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       console.log('Submission successful:', response.data);
  //       toast.success(response.data.message);
  //     } catch (error) {
  //       console.error('Error submitting form:', error);
  //       toast.error('Error submitting form');
  //     }
  //   }
  
  // };
  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false)
    setFormData({
      companyName: '',
      shortName: '',
      gstNo: '',
      jurisdiction: '',
      regAddress: '',
      panN: '',
      tanNo: '',
      cinNo: '',
      emailID: '',
      telNo: '',
      CoMob: '',
      website: '',
      ieCode: '',
      tdsCircle: '',
      tdsPerson: '',
      designation: '',
      msmeNo: '',
      msmeCat: '',
      msmeType: '',
      pinCode: '',
      remark1: '',
      remark2: '',
      workAddress: '',
    });
    setBranches([{
      branchCode: '',
      branchName: '',
      shortName: '',
      gstNo: '',
      cityId: '',
      branchAddress: '',
      branchTel: '',
      branchMobile: '',
      website: '',
      ieCode: '',
      msmeNo: '',
      msmeCat: '',
      msmeType: '',
      pinCode: '',
      remark1: '',
      remark2: '',
      status: '',
      dbFlag: '',
    }]);
    setCompanyId(null);
  };

  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
    setIsEditing(true);
  };
  const handleCancel = async () => {
    if (mode === 'add') {
      try {
        await fetchCompanyData(1, "L");
        setMode('view');
        setIsFormDisabled(true);
      } catch (error) {
        toast.error('Error occurred while cancelling. Please try again.');
      }
    } else if (mode === 'edit') {
      if (companyId) {
        await fetchCompanyData(companyId);
      }
      setMode('view');
      setIsFormDisabled(true);
    }
  };
  const handleBranchDelete = async () => {
    if (selectedBranch && !isMainBranchSelected) {
      try {
        const response = await axios.post(`http://43.230.196.21/api/CoMst_Cobr/RetriveCobrMst`, {
          CobrMstId: selectedBranch.branchCode,
        Flag: "D"
        });
        if (response.data.status === 0) {
          toast.success('Branch deleted successfully');
          const updatedTableData = tableData.filter(branch => branch.branchCode !== selectedBranch.branchCode);
          setTableData(updatedTableData);
          setBranches(updatedTableData);
          setSelectedBranch(null);
        } else {
          toast.error('Failed to delete branch');
        }
      } catch (error) {
        console.error('Error deleting branch:', error);
        toast.error('Error deleting branch. Please try again.');
      }
    }
  };
  const handleDelete = () => {
    setIsConfirmDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await fetchCompanyData(companyId, "D");
      toast.success('Data deleted successfully');
      await fetchCompanyData(companyId, "N");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error deleting company. Please try again.');
    }
    setIsConfirmDialogOpen(false);
  };

  const handleExit = () => {
    navigate('/masters/companytable')
  };
  // const handleConfirmBranch = () => {
  //   setIsAdding(false);
  //   const newBranch = {
  //     branchCode: currentBranch.branchCode,
  //     companyName: formData.companyName,
  //     branchName: currentBranch.branchName,
  //     gstNo: currentBranch.gstNo,
  //     pinCode: currentBranch.pinCode,
  //     branchAddress: currentBranch.branchAddress,
  //     state: 'N/A' // You might want to add a state field to your form
  //   };

  //   setTableData(prev => [...prev, newBranch]);
  //   setBranches(prev => [...prev, currentBranch]);

  //   // Reset currentBranch for next entry
  //   setCurrentBranch({
  //     branchCode: '',
  //     branchName: '',
  //     shortName: '',
  //     gstNo: '',
  //     jurisdiction: '',
  //     branchAddress: '',
  //     emailID: '',
  //     telNo: '',
  //     website: '',
  //     ieCode: '',
  //     msmeNo: '',
  //     msmeCat: '',
  //     msmeType: '',
  //     pinCode: '',
  //     remark1: '',
  //     remark2: '',
  //     bankDetails1: '',
  //     bankDetails2: '',
  //   });
  // };
  // const isFormDisabled = mode === 'view';

  const columns = [
    { id: 'branchCode', label: 'Br_Code', minWidth: 50 },
    { id: 'companyName', label: 'Company Name', minWidth: 150 },
    { id: 'branchName', label: 'Branch Name', minWidth: 150 },
    { id: 'gstNo', label: 'GSTIN', minWidth: 100 },
    { id: 'PinCode', label: 'Pincode', minWidth: 100 },
    { id: 'branchAddress', label: 'City', minWidth: 100 },
    { id: 'state', label: 'State', minWidth: 100 }
  ];
  const handleConfirmBranch = () => {
    if (mode === 'add') {
      const newBranch = { ...currentBranch, companyName: formData.companyName };
      setTableData(prev => [...prev, newBranch]);
      setBranches(prev => [...prev, newBranch]);
    } else if (mode === 'edit') {
      console.log(setIsEditing(true))
      const updatedBranches = branches.map(branch => 
        branch.branchCode === currentBranch.branchCode ? currentBranch : branch
      );
      setBranches(updatedBranches);
      setTableData(updatedBranches);
    }
    setMode('view');
    setIsFormDisabled(true);
    setIsAddingBranch(false);
    setIsEditingBranch(false);
    setIsConfirmEnabled(false);
    setCurrentBranch({
      branchCode: '',
      branchName: '',
      shortName: '',
      gstNo: '',
      jurisdiction: '',
      branchAddress: '',
      emailID: '',
      telNo: '',
      website: '',
      ieCode: '',
      msmeNo: '',
      msmeCat: '',
      msmeType: '',
      pinCode: '',
      remark1: '',
      remark2: '',
      bankDetails1: '',
      bankDetails2: '',
    });
    
    // Reset button states
    setIsAddButtonEnabled(true);
    setIsConfirmCancelEnabled(false);
  };
   const handleCancelBranch = () => {
    setMode('view');
    setIsFormDisabled(true);
    setSelectedBranch(null);
    setIsAddingBranch(false);
    setIsEditingBranch(false);
    setIsConfirmEnabled(false);
    setCurrentBranch({
      branchCode: '',
      branchName: '',
      shortName: '',
      gstNo: '',
      jurisdiction: '',
      branchAddress: '',
      emailID: '',
      telNo: '',
      website: '',
      ieCode: '',
      msmeNo: '',
      msmeCat: '',
      msmeType: '',
      pinCode: '',
      remark1: '',
      remark2: '',
      bankDetails1: '',
      bankDetails2: '',
    });
    setIsAddButtonEnabled(true);
    setIsConfirmCancelEnabled(false);
  };
  const handleRowClick = (index) => {
    setSelectedBranchIndex(index);
    const clickedBranch = tableData[index];
    setSelectedBranch(clickedBranch);
    setCurrentBranch(clickedBranch);
    setIsMainBranchSelected(clickedBranch.branchCode === formData.companyCode);
    setIsBranchEditDeleteEnabled(true);
    setIsAddButtonEnabled(false)
  };
  const renderStepContent = (step) => {
    return (
      <Box sx={{ height: '350px', overflowY: 'scroll', padding: '16px' }}>
        {(() => {
          switch (step) {
            case 0:
              return (
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label={
                                <span>
                                  Company Name <span style={{ color: 'red' }}>*</span>
                                </span>
                              }
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Short Name"
                              name="shortName"
                              value={formData.shortName || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label={
                                <span>
                                  jurisdiction <span style={{ color: 'red' }}>*</span>
                                </span>
                              }
                              name="jurisdiction"
                              value={formData.jurisdiction || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="PAN No"
                              name="panN"
                              value={formData.panN || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="GST No"
                              name="gstNo"
                              value={formData.gstNo}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="CIN No"
                              name="cinNo"
                              value={formData.cinNo || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="TAN No"
                              name="tanNo"
                              value={formData.tanNo || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                        <Grid item lg={12} md={12} xs={12}>
                          {/* <Grid container spacing={3}> */}
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="IE Code"
                                  name="ieCode"
                                  value={formData.ieCode}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="TDS Circle"
                                  name="tdsCircle"
                                  value={formData.tdsCircle}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="TDS Person"
                                  name="tdsPerson"
                                  value={formData.tdsPerson}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="Designation"
                                  name="designation"
                                  value={formData.designation}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12} display="flex" alignItems="center" justifyContent="center">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid #ccc"
                        borderRadius={1}
                        width={150}
                        height={170}
                        overflow="hidden"
                        position="relative"
                        sx={{ cursor: 'pointer' }} 
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Logo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Browse
                          </Typography>
                        )}

                        {/* Hidden input element */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{
                            position: 'absolute',
                            top: 0,left: 0,width: '100%',height: '100%',
                            opacity: 0, // Make it invisible
                            cursor: 'pointer', // Ensure the cursor indicates it's clickable
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Email ID"
                              name="emailID"
                              value={formData.emailID || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Tel No"
                              name="telNo"
                              value={formData.telNo || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Website"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME No"
                              name="msmeNo"
                              value={formData.msmeNo}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME Cat"
                              name="msmeCat"
                              value={formData.msmeCat}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME Type"
                              name="msmeType"
                              value={formData.msmeType}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Pin Code"
                              name="pinCode"
                              value={formData.pinCode || ''}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Remark1"
                              name="remark1"
                              value={formData.remark1}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Remark2"
                              name="remark2"
                              value={formData.remark2}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              label="Reg Address"
                              name="regAddress"
                              value={formData.regAddress || ''}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
                                },
                                '& .MuiInputBase-input': {
                                  resize: 'vertical',
                                },
                                '& .MuiFilledInput-root': {
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'transparent',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              fullWidth
                              label="Work Address"
                              name="workAddress"
                              value={formData.workAddress || ''}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
                                },
                                '& .MuiInputBase-input': {
                                  resize: 'vertical',
                                },
                                '& .MuiFilledInput-root': {
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'transparent',
                                  },
                                },
                              }}
                            />
                          </Grid>

                        </Grid>
                      </Box>

                    </Grid>
                  </Grid>

                </Grid>
              );
            case 1:
              return (
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Branch Code"
                              name="branchCode"
                              value={currentBranch.branchCode}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Short Name"
                              name="shortName"
                              value={currentBranch.shortName}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>

                        {/* Branch Name and Jurisdiction */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Branch Name"
                              name="branchName"
                              value={currentBranch.branchName}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Jurisdiction"
                              name="jurisdiction"
                              value={currentBranch.jurisdiction}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>

                        {/* GST No. and IE_Code */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="GST No"
                              name="gstNo"
                              value={currentBranch.gstNo}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="IE Code"
                              name="ieCode"
                              value={currentBranch.ieCode}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>

                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12} display="flex" alignItems="center" justifyContent="center">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid #ccc"
                        borderRadius={1}
                        width={150}
                        height={170}
                        overflow="hidden"
                        position="relative"
                        sx={{ cursor: 'pointer' }} // Change cursor to indicate clickable area
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Logo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Browse
                          </Typography>
                        )}

                        {/* Hidden input element */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>

                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Email ID"
                              name="emailID"
                              value={currentBranch.emailID || ''}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Tel No"
                              name="telNo"
                              value={currentBranch.telNo || ''}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Website"
                              name="website"
                              value={currentBranch.website}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>

                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME No"
                              name="msmeNo"
                              value={currentBranch.msmeNo}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME Cat"
                              name="msmeCat"
                              value={currentBranch.msmeCat}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="MSME Type"
                              name="msmeType"
                              value={currentBranch.msmeType}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Pin Code"
                              name="pinCode"
                              value={currentBranch.pinCode || ''}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Remark1"
                              name="remark1"
                              value={currentBranch.remark1}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Remark2"
                              name="remark2"
                              value={currentBranch.remark2}
                              onChange={handleBranchInputChangeNew}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6} lg={4}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="branchAddress"
                              value={currentBranch.branchAddress || ''}
                              onChange={handleBranchInputChangeNew}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
                                },
                                '& .MuiInputBase-input': {
                                  resize: 'vertical',
                                },
                                '& .MuiFilledInput-root': {
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'transparent',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={4}>
                            <TextField
                              fullWidth
                              label="Bank Details1"
                              name="bankDetails1"
                              value={currentBranch.bankDetails1}
                              onChange={handleBranchInputChangeNew}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
                                },
                                '& .MuiInputBase-input': {
                                  resize: 'vertical',
                                },
                                '& .MuiFilledInput-root': {
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'transparent',
                                  },
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={6} lg={4}>
                            <TextField
                              fullWidth
                              label="Bank Details2"
                              name="bankDetails2"
                              value={currentBranch.bankDetails2}
                              onChange={handleBranchInputChangeNew}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                '& .MuiInputBase-root': {
                                  height: '115px',
                                },
                                '& .MuiInputBase-input': {
                                  resize: 'vertical',
                                },
                                '& .MuiFilledInput-root': {
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'transparent',
                                  },
                                },
                              }}
                            />
                          </Grid>

                        </Grid>
                      </Box>

                    </Grid>
                  </Grid>

                </Grid>

              );
            default:
              return null;
          }
        })()}
      </Box>
    );
  };

  const handleStepClick = (step) => {
    if (mode === 'view' ) {
      setActiveStep(step);
    }
  };

  return (
    <Grid >
      <Box className="form-container">
        <ToastContainer />
        <Grid container spacing={2} className='rasidant_grid'>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                className='three-d-button-previous'
                onClick={handleCliclPrivious}
                disabled={mode !== 'view' || !companyId || companyId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                className='three-d-button-next'
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleClickNext}
                disabled={mode !== 'view' || !companyId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <Typography variant="h5">Company Master</Typography>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view'}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view'}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDelete}
                disabled={mode !== 'view'}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view'}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Stepper activeStep={activeStep} connector={<CustomStepConnector />} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepClick(index)} style={{ cursor: mode === 'view'  ? 'pointer' : 'default' }}>
                  <CustomStepLabel
                    sx={{ mt: 0, pt: 0 }}
                    StepIconComponent={(props) => (
                      <CustomStepIcon ownerState={{ ...props, active: activeStep === index }}>
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
          {activeStep === 1 ? (<>
            <Paper sx={{ width: '90%', overflow: 'hidden', margin: '0px 0px 0px 50px', border: '1px solid lightgray' }}>
              <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow
                      sx={{
                        '& > th': {
                          padding: '2px  10px 2px  10px',
                        }
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {column.label}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow
                        hover
                        key={index}
                        onClick={() => handleRowClick(index)}
                        sx={{
                          '& > td': {
                            padding: '2px 14px 2px 19px',
                          },
                          backgroundColor: selectedBranchIndex === index ? '#e3f2fd' : 'inherit',
                          cursor: 'pointer'
                        }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value || 'N/A'}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </Paper>
            <Grid item xs={12} md={12} lg={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>

                <Grid xs={12} md={12} lg={12}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: '#7c3aed' }}

                // disabled={mode === 'view'}
                onClick={handleBranchAdd}
             
          disabled={!isAddButtonEnabled}
                >
                  <AddIcon />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                  onClick={handleBranchEdit}
                  
                  // disabled={mode === 'view' || mode ===''}
                  disabled={!isBranchEditDeleteEnabled}

                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: '#7c3aed' }}
                  // onClick={handleDelete}
                  onClick={handleBranchDelete}

                  // disabled={mode === 'view'}
                  disabled={!isBranchEditDeleteEnabled}


                >
                  <DeleteIcon />
                </Button>
                </Grid>
                   <Grid xs={6} md={12}>
                   <Button
                     variant="contained"
                     size="small"
                     sx={{ backgroundColor: '#7c3aed' }}
                     onClick={handleConfirmBranch}
                     disabled={!isConfirmCancelEnabled}
                   >
                     Confirm
                   </Button>
                   <Button
                     variant="contained"
                     size="small"
                     sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                     onClick={handleCancelBranch}

                    //  disabled={mode === 'view' || mode ===''}
                    disabled={!isConfirmCancelEnabled}

                   >
                    Cancel
                   </Button>
                   
                   </Grid>

              </Grid>
              <Grid>

              </Grid>
     
          </>) : ('')
          }
          <Grid item xs={12}>
            {renderStepContent(activeStep)}
          </Grid>

          <Grid item xs={12} className="form_button">
            <Button
              variant="contained"
              size="small"
              // sx={{ backgroundColor: '#7c3aed', mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
              onClick={handleBack}
              disabled={activeStep === 0 || mode !== 'view'}

            >
              {/* {activeStep === steps.length - 1 ? 'Previous' : ''} */}
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              // sx={{ mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              // sx={{ mr: 1 }}
              sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this data?"
        onConfirm={handleConfirmDelete}
      />
    </Grid>
  );
};

export default Company;
