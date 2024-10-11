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

const steps = ['Vendor Details', 'Branch Details']; // defining the steps for the pages
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
const PartyForm = () => {
    const [activeStep, setActiveStep] = useState(0); // to Define the active steps
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [rows, setRows] = useState([]);
    const [mode, setMode] = useState('view');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isFormDisabled, setIsFormDisabled] = useState(true);
    const [companyId, setCompanyId] = useState()
    const [photo, setPhoto] = useState('');
    const [photos, setPhotos] = useState('');
    const [file, setFile] = useState(null);
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
    const location = useLocation();
    const navigate = useNavigate()
    // to get the id form the url if it is present
    useEffect(() => {
        if (location.state && location.state.companyId) {
            console.log(location.state, "to check what is coming in url")
            setCompanyId(location.state.companyId);
            fetchCompanyData(location.state.companyId); // calling the function to fill the data accordingly
            setMode('view');
        } else {
            setMode('add');
            setIsFormDisabled(false);
        }
    }, [location]);
    const fetchCompanyData = async (id, flag) => {   //  the function where we get the data
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}PartyMst/RetrivePartyMstAll`, {
                PartyId: parseInt(id),
                Flag: flag
            });
            if (response.data.status === 0 && response.data.responseStatusCode === 1) {
                const company = response.data.data.CoMstList[0];
                const branches = response.data.data.CoMstList[0].CobrMstList;
                console.log('com', company)
                console.log('br', branches)
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
                console.log('CobrName', branches)
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
    }; // api se daata

    // handling the file upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Use a Promise to handle the file reading
            const readFileAsBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        resolve(reader.result); // This will be the Base64 string
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            };

            // Read the file and update the state
            readFileAsBase64(file)
                .then(base64String => {
                    setFormData(prevData => ({
                        ...prevData,
                        photo: base64String
                    }));
                })
                .catch(err => {
                    console.error('Error reading file:', err);
                    toast.error('Error reading file. Please try again.');
                });
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Use a Promise to handle the file reading
            const readFileAsBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        resolve(reader.result); // This will be the Base64 string
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            };

            // Read the file and update the state
            readFileAsBase64(file)
                .then(base64String => {
                    setFormData(prevData => ({
                        ...prevData,
                        photos: base64String
                    }));
                })
                .catch(err => {
                    console.error('Error reading file:', err);
                    toast.error('Error reading file. Please try again.');
                });
        }
    };
    const handleInputChange = (event) => {  // basic handle input collection
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
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
            console.log('company', companyBranch)
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
        navigate('/masters/partyTable/')
    };
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
    return (
        <>
        </>
    )
}

export default PartyForm