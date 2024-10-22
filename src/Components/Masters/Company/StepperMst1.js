import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 
let pincity = [];
const StepperMst1 = forwardRef(
  (
    {
      index,
      mode,
      CompanyData,
      Cities,
      AllTextDisabled,
      AllButtonDisabled,
      addModeDis,
      viewModeDis,
      stepToNext,
      setMode,
    },
    ref
  ) => {
    const { register, setValue, reset, watch, getValue } = useForm();
    const [PinCity, setPincity] = useState([]);
    const [SelectedPinId, setSelectedPinId] = useState(" ");

    useEffect(() => {
      if (mode === "view" && CompanyData.length > 0) {
        let fieldObj = watch();
        for (let key in fieldObj) {
          setValue(key, CompanyData[index][key]);
        }
        let Pinobj = { target: { value: watch("PinCode") } };
        let AreaObj = { target: { value: CompanyData[index]["PinID"] } };
        console.log("new obj", AreaObj);
        handlePinChange(Pinobj);
        handleAreaChange(AreaObj);
      } else if (mode === "add") {
        resetFunc();
      } else {
        console.log("data is fetching");
      }
    }, [CompanyData, index, mode]);

    const resetFunc = () => {
      console.log("hii", watch());
      reset({
        area: " ",
        CoAbrv: " ",
        CoCin: " ",
        CoEmail: " ",
        CoName: " ",
        CoPan: " ",
        CoRegAdd: " ",
        CoTan: " ",
        CoMob: " ",
        CoTel: " ",
        Designation: " ",
        GSTIN: " ",
        IeCode: " ",
        MsmeCat: " ",
        MsmeNo: " ",
        MsmeType: " ",
        PinID: "",
        Remark1: " ",
        Remark2: " ",
        TdsCircle: " ",
        TdsPerson: " ",
        Website: " ",
        WorkAddr: " ",
        PinCode: " ",
        CityId: "",
       
      });
    };

    const handlePinChange = async (e) => {
      let { value } = e.target;
      console.log("val", value);

      if (value.length > 4) {
        try {
          const response = await axios.post(
            "http://43.230.196.21/api/pincodeMst/getdrppincodewisearea",
            {
              PinCode: parseInt(value),
            }
          );
          const data = response.data.data;
          console.log("data", data);
          if (data && data.length > 0) {
            setPincity(data);
            pincity = data;
            console.log("PinID", data);
          } else {
            setPincity([]);
          }
        } catch (error) {
          console.error("Error fetching pin code data:", error);
        }
      }
    };

    const handleClick = () => {};

    const handleNameChange = (e) => {
      let cityname = e.target.value;
    };

    const handleClickNext = () => {
      setValue("PinID", SelectedPinId);
      console.log("PinId", watch("PinId"));
      const { CoName, CityId, PinID } = watch();
      console.log(watch());

      if (CoName != " " && CityId != " " && PinID != " ") {
        stepToNext(watch());
      } else {
        console.log("filled the essential field");
         toast.error("Please Fill The Mandatory Filled");
      }
    };
    const HandleNextStep = () => {
      console.log("next Step Click");
    };

    const handleCancel = () => {
      if (CompanyData.length > 0) {
        let fieldObj = watch();
        for (let key in fieldObj) {
          setValue(key, CompanyData[index][key]);
        }
        viewModeDis();
        setMode("view`");
      }
    };

    const handleAreaChange = (e) => {
      let val = e.target.value;
      setSelectedPinId(val);
    };

    return (
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          <Grid item lg={8} md={8} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
            <ToastContainer />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={
                      <span>
                        Company Name <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="companyName"
                    variant="filled"
                    {...register("CoName")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Short Name"
                    name="shortName"
                    variant="filled"
                    {...register("CoAbrv")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  {/* <FormControl className='custom-textfield' fullWidth variant="filled" >
                                <InputLabel>
                                  Jurisdiction <span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <Select
                                  onChange={handleNameChange}
                                  name="jurisdiction"
                                 className="custom-textfield"
                               
  
                                >
                                  {Cities?.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                  ))}
                                </Select>
                                
              </FormControl> */}
                  <select
                    id="jurisdiction"
                    name="jurisdiction"
                    {...register("CityId")} 
                    value={watch("CityId")} 
                    style={{
                      height: "50px",
                      width: "14vw",
                      borderColor: "smokewhite",
                      borderRadius: "5px",
                      padding: "0 10px",
                      fontSize: "16px",
                      color: "gray",
                    }}
                    disabled={AllTextDisabled} // Disable the select when needed
                  >
                    {/* This option acts as the placeholder */}
                    <option value="" disabled>
                      Select Jurisdiction{" "}
                      <span style={{ color: "red" }}>*</span>
                    </option>

                    {/* Map over cities and render options */}
                    {Cities?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="PAN No"
                    name="panN"
                    variant="filled"
                    {...register("CoPan")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="GST No"
                    name="gstNo"
                    variant="filled"
                    {...register("GSTIN")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="CIN No"
                    name="cinNo"
                    variant="filled"
                    {...register("CoCin")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="TAN No"
                    name="tanNo"
                    variant="filled"
                    {...register("CoTan")}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
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
                        name="IeCode"
                        variant="filled"
                        className="custom-textfield"
                        {...register("IeCode")}
                        disabled={AllTextDisabled}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="TDS Circle"
                        name="TdsCircle"
                        variant="filled"
                        className="custom-textfield"
                        {...register("TdsCircle")}
                        disabled={AllTextDisabled}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="TDS Person"
                        name="TdsPerson"
                        variant="filled"
                        className="custom-textfield"
                        {...register("TdsPerson")}
                        disabled={AllTextDisabled}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Designation"
                        name="Designation"
                        variant="filled"
                        className="custom-textfield"
                        {...register("Designation")}
                        disabled={AllTextDisabled}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Box>
          </Grid>
          <Grid
            item
            lg={4}
            md={4}
            xs={12}
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
              {/* {selectedImage ? (
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
            )} */}

              {/* Hidden input element */}
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
                }}
              />
            </Box>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid container spacing={3}></Grid>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Wrapping the entire Grid in a Box for spacing */}
              <Grid container spacing={4}>
                {/* First column: Email ID */}
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Email ID"
                    name="emailID"
                    variant="filled"
                    className="custom-textfield"
                    {...register("CoEmail")}
                    disabled={AllTextDisabled}
                  />
                </Grid>

                {/* Second column: Tel No */}
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Tel No"
                    name="telNo"
                    variant="filled"
                    className="custom-textfield"
                    {...register("CoTel")}
                    disabled={AllTextDisabled}
                  />
                </Grid>

                {/* Third column: Mobile No */}
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Mob No"
                    name="CoMob"
                    variant="filled"
                    className="custom-textfield"
                    {...register("CoMob")}
                    disabled={AllTextDisabled}
                  />
                </Grid>

                {/* Fourth column: Website */}
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="Website"
                    variant="filled"
                    className="custom-textfield"
                    {...register("Website")}
                    disabled={AllTextDisabled}
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
                    name="MsmeNo"
                    variant="filled"
                    className="custom-textfield"
                    {...register("MsmeNo")}
                    sx={{
                      "& .MuiInputLabel-root": {
                        marginBottom: "8px",
                      },
                      "& .MuiFilledInput-root": {
                        marginTop: "4px",
                      },
                    }}
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="MSME Cat"
                    name="MsmeCat"
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
                    name="MsmeType"
                    variant="filled"
                    className="custom-textfield"
                    {...register("MsmeType")}
                    disabled={AllTextDisabled}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid container spacing={3}>
                {/* Pin Code Field */}
                <Grid item xs={12} md={4} lg={3}>
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

                {/* Area Dropdown */}
                <Grid item xs={12} md={4} lg={3}>
                  <select
                    id="area"
                    name="area"
                    {...register("PinID", { onChange: handleAreaChange })}
                    defaultValue="select value"
                    style={{
                      height: "50px",
                      width: "100%",
                      borderColor: "smokewhite",
                      borderRadius: "5px",
                      padding: "0 10px",
                      fontSize: "16px",
                      color: "gray",
                    }}
                    disabled={AllTextDisabled}
                  >
                    <option value="" disabled>
                      Select Area {" "}
                      <span style={{ color: "red" }}>*</span>
                    </option>

                    {/* Mapping over pincity data */}
                    {pincity?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </Grid>

                {/* Remark1 Field */}
                <Grid item xs={12} md={4} lg={3}>
                  <TextField
                    fullWidth
                    label="Remark1"
                    name="Remark1"
                    variant="filled"
                    className="custom-textfield"
                    {...register("Remark1")}
                    disabled={AllTextDisabled}
                  />
                </Grid>

                {/* Remark2 Field */}
                <Grid item xs={12} md={4} lg={3}>
                  <TextField
                    fullWidth
                    label="Remark2"
                    name="Remark2"
                    variant="filled"
                    {...register("Remark2")}
                    onChange={handlePinChange}
                    className="custom-textfield"
                    disabled={AllTextDisabled}
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
                    multiline
                    rows={2}
                    variant="filled"
                    className="custom-textfield"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "115px",
                      },
                      "& .MuiInputBase-input": {
                        resize: "vertical",
                      },
                      "& .MuiFilledInput-root": {
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",
                        },
                      },
                    }}
                    {...register("CoRegAdd")}
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label="Work Address"
                    name="WorkAddress"
                    multiline
                    rows={2}
                    variant="filled"
                    className="custom-textfield"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "115px",
                      },
                      "& .MuiInputBase-input": {
                        resize: "vertical",
                      },
                      "& .MuiFilledInput-root": {
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",
                        },
                      },
                    }}
                    {...register("WorkAddr")}
                    disabled={AllTextDisabled}
                  />
                </Grid>
                <Grid item xs={12} className="form_button">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mr: 1,
                       background  :AllTextDisabled  && 'linear-gradient(290deg, #d4d4d4, #ffffff)'
                   
                    }}
                    onClick={handleClickNext}
                    disabled={AllTextDisabled}
                    
            
                  >
                    Next
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mr: 1,
                       background  :AllTextDisabled  && 'linear-gradient(290deg, #d4d4d4, #ffffff)'
                    }}
                    onClick={handleCancel}
                    disabled={AllTextDisabled}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);
export default StepperMst1;
