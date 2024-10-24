import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
  Tab,
  Add,
} from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../../Auth";


const StepperMst2 = ({ TableData, mode, Cities, setTableData, AllfieldStepperData, CompanyId, setActiveStep, fetchCompanyData }) => {
  const { register, watch, reset, setValue } = useForm();
  const navigate = useNavigate();
  const [AllTextDisabled, setAllTextDisabled] = useState(false);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(true);
  const [IndexofSelect, setIndexofSelect] = useState(0);
  const [InternalMode, setInternalMode] = useState("add");
  const [PinCity, setPincity] = useState([]);
  const [AddDisabled, setAddDisabled] = useState(false);
  const [openDialog, setopenDialog] = useState(false);


  useEffect(() => {
    console.log("TableData", TableData);
  }, [TableData]);

  useEffect(() => {
    console.log("watch", watch());
    if (IndexofSelect === -1) return;
    if (mode === "add") {
      let obj = TableData[IndexofSelect];
      for (let key in obj) {
        setValue(key, TableData[IndexofSelect][key]);
      }

    } else {
      console.log("index", IndexofSelect);
      let obj = TableData[IndexofSelect];
      for (let key in obj) {
        setValue(key, TableData[IndexofSelect][key]);
      }
      let PinCodeObj = { target: { value: TableData[IndexofSelect]['PinCode'] } };
      console.log("PinCodeObj", PinCodeObj)
      handlePinChange(PinCodeObj);
      setValue('PinId', TableData[IndexofSelect]['PinId'])

    }
    setAllTextDisabled(true);
  }, [IndexofSelect]);

  const columns = [
    { id: "CobrMstId", label: "Code", minWidth: 50 },
    { id: "MainBranch", label: "Main", minWidth: 50 },
    { id: "CobrName", label: "Company Name", minWidth: 50 },
    { id: "GSTIN", label: "GSTIN", minWidth: 50 },
    { id: "PinID", label: "Pincode", minWidth: 50 },
    { id: "CityId", label: "City", minWidth: 50 },
    { id: "DBFLAG", label: "Flag", minWidth: 50 },
  ];

  const handlePreviousClick = () => {
    console.log("Click");
    // navigate(`/CompanyMst`, { state: { CompanyId ,mode: 'view'}})
    setActiveStep(0);
  }

  const resetFunc = () => {
    console.log("hii", watch());
    reset({
      CityId: "",
      CobrAbrv: " ",
      CobrAdd: " ",
      CobrEmail: " ",
      CobrMstId: " ",
      CobrName: " ",
      CobrTel: " ",
      GSTIN: " ",
      IeCode: " ",
      MsmeCat: " ",
      MsmeNo: " ",
      MsmeType: "",
      Remark1: " ",
      Remark2: " ",
      Website: " ",
      CobrMob: ' ',
      PinID: "",
      PinCode: ' ',
    });
  };

  const handleClickAdd = () => {
    setInternalMode("Add");
    setAllTextDisabled(false);
    resetFunc();
    setIndexofSelect(-1);
    setAllButtonDisabled(true);
    setAddDisabled(true);
  };

  const handleClickEdit = () => {
    setInternalMode("Edit")
    setAllTextDisabled(false);
    setAllButtonDisabled(true);
    setAddDisabled(true);
  };

  const handleRowClick = (rowIndex) => {
    console.log(rowIndex);
    setIndexofSelect(rowIndex);
    if (rowIndex == 0) {
      setAddDisabled(false);
      setAllButtonDisabled(true);
      setAllTextDisabled(true);
      return;
    }
    setAllButtonDisabled(false);
    setAllTextDisabled(true);
  };

  const handleClickConfirm = () => {
    let obj = watch();
    if (obj.CobrName === " ") {
      toast.info("Plz Filled the Data");
      return;
    };
    obj.CityId = parseInt(obj.CityId);
    obj.PinID = parseInt(obj.PinID);

    let branchName = obj.CobrName;
    let duplicateInd = TableData.findIndex((obj => obj.CobrName === branchName));

    if (duplicateInd < 0) {
      if (InternalMode === "Add") {
        console.log(watch());
        obj.CobrMstId = 0;
        obj.DBFLAG = "I";
        obj.Status = "1";
        obj.MainBranch = "0";
        let newTabData = [...TableData];
        newTabData.push(obj);
        setTableData(newTabData);
        toast.success("Form Data Added In Table");
      } else {
        console.log("IndexofSelect", IndexofSelect);
        console.log("TableData", TableData);
        TableData[IndexofSelect].DBFLAG === "I" ? obj.DBFLAG = "I" : obj.DBFLAG = "U";
        let TabData = [...TableData];
        for (let key in obj) {
          TabData[IndexofSelect][key] = obj[key];
        }
        console.log("TabData", TabData);
        setTableData(TabData);
        toast.success("Form Data Updated  In Table");
      }
      setAllButtonDisabled(false);
      setAllTextDisabled(true);
    } else {
      console.log("duplicate Name");
      toast.error("Duplicate Name")
    }
  };


  const handleDelete = () => {
    setopenDialog(true);
    console.log("click");
    toast.success("Data Deleted");
  }

  const handleCancel = () => {
    setopenDialog(false);
  }
  const handleConfirmDelete = () => {
    console.log("hii");
    console.log(IndexofSelect);
    let TabData = [...TableData];
    let flag = TableData[IndexofSelect].DBFLAG;
    if (flag === "U" || flag === "R") {
      TabData[IndexofSelect].DBFLAG = "D";
    } else if (flag === "I") {
      TabData = TableData.filter((obj, index) => index !== IndexofSelect);
    }
    setTableData(TabData);
    setopenDialog(false);


  }
  const handleClickCancel = () => {
    setAllButtonDisabled(false);
    setAllTextDisabled(true);
    resetFunc();
    if (TableData.length > 1) {
      setIndexofSelect(1);
    } else {
      setIndexofSelect(0);
    }
  };

  const handlePinChange = async (e) => {
    let { value } = e.target;
    console.log("val", value);

    if (value.length > 4) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}pincodeMst/getdrppincodewisearea`,
          {
            PinCode: parseInt(value),
          },
          AuthHeader()
        );
        const data = response.data.Data;
        console.log("data", data);
        if (data && data.length > 0) {
          setPincity(data);
          console.log("pinId", data);
        } else {
          setPincity([]);
        }
      } catch (error) {
        console.error("Error fetching pin code data:", error);
      }
    }
  };



  const handleSubmit = async () => {
    if (mode === "add") {

      if (AllfieldStepperData.hasOwnProperty("area")) {
        delete AllfieldStepperData.area;
      }
      if (AllfieldStepperData.hasOwnProperty("PinId")) {
        delete AllfieldStepperData.area;
      }
      AllfieldStepperData.DBFLAG = "I";
      AllfieldStepperData.Status = "1";
      AllfieldStepperData.PinID = parseInt(AllfieldStepperData.PinID);
      AllfieldStepperData.CityId = parseInt(AllfieldStepperData.CityId);
      // AllfieldStepperData.cobrMstList = TableData;
      AllfieldStepperData.CobrMstList = [...TableData];

      let FormattedObj = JSON.stringify(AllfieldStepperData).replace(/"/g, '\\"');
      FormattedObj = '"' + FormattedObj + '"';
      console.log("string ", FormattedObj);
      // const myHeaders = {
      //   "Content-Type": "application/json"
      // };
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_URL}CoMst/ManageCompanyBranch`,
          FormattedObj,
          AuthHeader()
        );
        console.log("response", response);
        toast.success(response.data.Message,{autoClose : 1000});
        setTimeout(() => {
          navigate(`/masters/companytable`)
        }, 1800);
      } catch (err) {
        console.log("err", err);
      }
      //   try{
      //   let response  = await axios.post(
      //     `${process.env.REACT_APP_API_URL}CoMst/ManageCompanyBranch`,
      //     FormattedObj
      //   );
      //   console.log("response",response);
      // }
      // catch(err){
      //    console.log("err",err);
      // }
      console.log("AllfieldStepperData", FormattedObj);

    } else {


      console.log("update request");
      if (AllfieldStepperData.hasOwnProperty("area")) {
        delete AllfieldStepperData.area;
      }
      AllfieldStepperData.DBFLAG = "U";
      AllfieldStepperData.Status = "1";
      AllfieldStepperData.CoMstId = CompanyId;
      AllfieldStepperData.PinID = parseInt(AllfieldStepperData.PinID);
      AllfieldStepperData.CityId = parseInt(AllfieldStepperData.CityId);
      // AllfieldStepperData.cobrMstList = TableData;
      AllfieldStepperData.CobrMstList = [...TableData];
      console.log("Data", AllfieldStepperData);
      let FormattedObj = JSON.stringify(AllfieldStepperData).replace(/"/g, '\\"');
      FormattedObj = '"' + FormattedObj + '"';

      // const myHeaders = {
      //   "Content-Type": "application/json"
      // };
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_URL}CoMst/ManageCompanyBranch`,
          FormattedObj,
          AuthHeader()
        );
        console.log("response", response);
        toast.success(response.data.Message,{autoClose : 1000});
        setTimeout(() => {
          navigate(`/masters/companytable`)
        }, 1800);
      } catch (err) {
        console.log("err", err);
      }


    }
  }

  const handleClickCancelButton = () => {
    console.log("click");
    fetchCompanyData(1, "L");
    setActiveStep(0);
  }

  return (
    <Grid container spacing={2}>
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
      {/* Table Section */}
      <Grid item xs={12}>
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            margin: "0px 0px 0px 50px",
            border: "1px solid lightgray",
          }}
        >
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ "& > th": { padding: "2px 10px" } }}>
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
                {TableData.map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      "& > td": { padding: "2px 14px" },
                      cursor: "pointer",
                    }}
                    onClick={() => handleRowClick(index)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value || "N/A"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Buttons */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#7c3aed" }}
            onClick={handleClickAdd}
            disabled={AllButtonDisabled && AddDisabled}
          >
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
            disabled={AllButtonDisabled}
            onClick={handleClickEdit}
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
        </Box>
        <Box>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#7c3aed" }}
            disabled={!AllButtonDisabled || !AddDisabled}
            onClick={handleClickConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
            disabled={!AllButtonDisabled || !AddDisabled}
            onClick={handleClickCancel}
          >
            Cancel
          </Button>
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        {/* Left Side: Text fields */}
        <Grid item xs={12} md={8}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Branch Code"
                  name="branchCode"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrMstId")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Short Name"
                  name="shortName"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrAbrv")}
                  disabled={AllTextDisabled}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Branch Name"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrName")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <select
                  id="jurisdiction"
                  name="jurisdiction"
                  {...register("CityId")}
                  value={watch("CityId")}
                  style={{
                    height: "50px",
                    width: "29vw",
                    borderColor: "smokewhite",
                    borderRadius: "5px",
                    padding: "0 10px",
                    fontSize: "16px",
                    color: "gray",
                  }}
                  disabled={AllTextDisabled}
                >
                  {/* This option acts as the placeholder */}
                  <option value="" disabled selected>
                    Select Jurisdiction
                  </option>

                  {Cities?.map((option) => (
                    <option key={option.Id} value={option.Id}>
                      {option.Name}
                    </option>
                  ))}
                </select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GST No"
                  variant="filled"
                  className="custom-textfield"
                  {...register("GSTIN")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IE Code"
                  variant="filled"
                  className="custom-textfield"
                  {...register("IeCode")}
                  disabled={AllTextDisabled}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right Side: File upload */}
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
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
            sx={{ cursor: "pointer" }}
          >
            <input
              type="file"
              accept="image/*"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </Box>
        </Grid>

        {/* Contact and MSME Details */}
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email ID"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrEmail")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Tel No"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrTel")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mob Num"
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrMob")}
                  disabled={AllTextDisabled}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* MSME and Address Details */}
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="MSME No"
                  variant="filled"
                  className="custom-textfield"
                  {...register("MsmeNo")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="MSME Cat"
                  variant="filled"
                  className="custom-textfield"
                  {...register("MsmeCat")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="MSME Type"
                  variant="filled"
                  className="custom-textfield"
                  {...register("MsmeType")}
                  disabled={AllTextDisabled}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pin Code"
                  name="pinCode"
                  variant="filled"
                  className="custom-textfield"
                  {...register("PinCode", { onChange: handlePinChange })}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <select
                  id="area"
                  name="area"
                  {...register("PinID")}
                  defaultValue={"select value"}
                  style={{
                    height: "50px",
                    width: "29vw",
                    borderColor: "smokewhite",
                    borderRadius: "5px",
                    padding: "0 10px",
                    fontSize: "16px",
                    color: "gray",
                  }}
                  disabled={AllTextDisabled}
                >
                  {/* Placeholder option */}
                  <option value="" disabled selected>
                    Select Area
                  </option>

                  {/* Mapping over pincity data */}
                  {PinCity?.map((option) => (
                    <option key={option.Id} value={option.Id}>
                      {option.Name}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Website"
                  variant="filled"
                  className="custom-textfield"
                  {...register("Website")}
                  disabled={AllTextDisabled}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Address and Bank Details */}
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" gap={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Address"
                  name="branchAddress"
                  multiline
                  rows={2}
                  variant="filled"
                  className="custom-textfield"
                  {...register("CobrAdd")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Bank Details1"
                  name="bankDetails1"
                  multiline
                  rows={2}
                  variant="filled"
                  className="custom-textfield"
                  {...register("Remark1")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Bank Details2"
                  name="bankDetails2"
                  multiline
                  rows={2}
                  variant="filled"
                  className="custom-textfield"
                  {...register("Remark2")}
                  disabled={AllTextDisabled}
                />
              </Grid>
              <Grid
                item
                xs={2}
                className="form_button"
                sx={{
                  display: "flex",
                  gap : "10px",
                  alignItems: "center",
                  marginTop: "10px",
                  marginLeft: "70vw",
                  textAlign: "right",
                  
                }}
              >
                {['Previous', 'Submit', 'Cancel'].map((label, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    sx={{ backgroundColor: "#7c3aed" }}
                    onClick={label === 'Previous' ? handlePreviousClick : label === 'Submit' ? handleSubmit : handleClickCancelButton}
                 
                  >
                    {label}
                  </Button>
                ))}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepperMst2;
