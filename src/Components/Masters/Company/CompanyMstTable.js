import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Box } from '@mui/material';
import axios from 'axios';
import Button from '@mui/material/Button';

const CompanyMstTable = () => {
  const navigate = useNavigate();
  const [columns] = useState([
    { id: 'coMstId', label: "Co.Id", minWidth: 50 },
    { id: 'coName', label: 'Company', minWidth: 80 },
    { id: 'coName', label: 'Place', minWidth: 80 },
    { id: 'gstin', label: 'GSTIN', minWidth: 50 },
    { id: 'pinId', label: 'Pincode', minWidth: 50 },
    { id: 'cityName', label: 'City', minWidth: 50 },
    
  ]);


  const [allData, setAllData] = useState([]);  
  const [rows, setRows] = useState([]); 
  const [searchValues, setSearchValues] = useState({
    name: '',
    shortname: '',
    remark: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}CoMst_Cobr/GetCoMst_CobrMstDashBoard`, {
      start: 0,
      PageSize: 0,
      SearchText: ""
    })
    .then((res) => {
      let arr = res.data.data;
      console.log("arr", arr);
      let newdata = arr.map(({ hkTypeName, abrv, remark, hkTypeId }) => ({
        name: hkTypeName,
        shortname: abrv,
        remark: remark, 
        hkTypeId: hkTypeId
      }));
      setAllData(newdata);
      setRows(newdata); 
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  
  const handleSearchChange = (columnId, value) => {
    console.log(columnId ,value);
    const newSearchValues = { ...searchValues, [columnId]: value };
    setSearchValues(newSearchValues);

   
    const filteredRows = allData.filter(row => {
      return Object.keys(newSearchValues).every(key => 
        row[key].toString().toLowerCase().includes(newSearchValues[key].toLowerCase())
      );
    });

    setRows(filteredRows);
  };

  
  const handleRowDoubleClick = (row) => {
    console.log("Row double clicked: ", row);
    navigate(`/HouseKeepingTableData/${row.hkTypeId}`);
  };

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); 
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

 
  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleLocationclick = () => {
    navigate('/masters/operations');
  };

  const handleNavigate = () => {
    navigate(`/HouseKeepingTableData`);
  };

  return (
    <div>
      <Box
        sx={{
          backgroundColor: '#e6edfc',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link onClick={handleHomeClick} className="text-d-none" underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            Home
          </Link>
          <Typography color="text.primary" onClick={handleLocationclick} sx={{ cursor: 'pointer' }}>
            Company
          </Typography>
          <Typography color="text.primary">Company Master</Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          onClick={handleNavigate}
          size='small'
          sx={{
            backgroundColor: '#635BFF',
            color: 'white',
            '&:hover': {
              backgroundColor: '#5249f',
            },
          }}
        >
          Add New Record
        </Button>
      </Box>

      <Paper sx={{ width: '80%', overflow: 'hidden', margin: '0px 0px 0px 50px', border: '1px solid lightgray', marginTop: '30px' }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ '& > th': { padding: '2px 10px', textAlign: 'center' } }}>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {column.label}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      placeholder={`Search ${column.label}`}
                      value={searchValues[column.id] || ''}
                      onChange={(e) => handleSearchChange(column.id, e.target.value)}
                      sx={{ mt: 1, margin: '0px', '& .MuiOutlinedInput-input': { padding: '2px 6px' } }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                     {paginatedRows.map((row) => (
                      <TableRow hover key={row.hkTypeId} onDoubleClick={() => handleRowDoubleClick(row)} style={{ cursor: 'pointer' }} sx={{ '& > td': { padding: '2px 14px 2px 19px' } }}>
                       {columns.map((column) => (
                          <TableCell key={column.id} align="center">
                           {row[column.id]}
                      </TableCell>
                   ))}
              </TableRow>
  ))}
        </TableBody>
          </Table>
          </TableContainer>

            <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default CompanyMstTable;
