import  React,{useState,useEffect} from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Breadcrumbs, Link, Typography, Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../../../Auth';


const columns = [
  {id:'PartyId',label:'Code',minWidth:10}, 
  {id:'PartyName',label:'Name',minWidth:10}, 
  {id:'GsttinNo',label:'GSTIN',minWidth:10}, 
  {id:'PartyAbrv',label:'ABRV',minWidth:10}, 
  {id:'MobileNo',label:'Mobile',minWidth:10}, 
  {id:'ContactPerson',label:'Contact Person',minWidth:10}, 
 
];

export default function PartyMasterTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerms, setSearchTerms] = useState({});
  const [rows, setRows] = useState([]);
  const [PartyArrData , setPartyArrData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { 
    console.log("Auth",AuthHeader());
    fetchCompanyData();
  
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}PartyMst/GetPartyMstDashBoard`,{
        start:1,
         PageSize:1,
         SearchText:""
        },AuthHeader());
      console.log("response-data ",response); 
      setRows(response.data.Data) 
  }
  catch(err){
     console.log("err",err);
  }
}

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate('/partymaster');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleSearchChange = (columnId, value) => {
    setSearchTerms(prev => ({ ...prev, [columnId]: value }));
    setPage(0);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => {
      return Object.entries(searchTerms).every(([columnId, term]) => {
        if (!term) return true;
        const value = row[columnId];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return true;
      });
    });
  }, [searchTerms, rows]);

  const handleRowDoubleClick = (partyId) => {
    navigate('/partymaster', { state: { partyId ,mode: 'view'}} );
  };
  const handleLocationclick=()=>{
    // navigate(``)
  }

  return (
    <>
      <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}>
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
            <Link onClick={handleHomeClick} className="text-d-none" underline="hover" color="inherit" sx={{cursor:'pointer'}}>
              Home
            </Link>
            <Typography color="text.primary" onClick={handleLocationclick} sx={{cursor:'pointer'}}>AR/AP</Typography>
            <Typography color="text.primary">Party Master</Typography>
          </Breadcrumbs>

          <Button
            variant="contained"
            onClick={handleClick}
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
        <Paper sx={{ width: '90%', overflow: 'hidden', margin: '0px 0px 0px 50px', border:'1px solid lightgray' }}>
          <TableContainer sx={{ maxHeight: 450 , overflowY: 'auto', overflowX: 'scrollable' }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow
                  sx={{ 
                    '& > th': { 
                      padding: '2px  10px 2px  10px',
                      textAlign:'center'
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
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder={`Search ${column.label}`}
                        onChange={(e) => handleSearchChange(column.id, e.target.value)}
                        sx={{ mt: 1 ,margin:'0px' ,'& .MuiOutlinedInput-input': {
                         padding: '2px 6px',  
                         },}}

                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredRows
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row,index) => {
      // Create a unique key
      const uniqueKey = `${row.companyId}-${row.cityName}`; 
      return (
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={index}
          onDoubleClick={() => handleRowDoubleClick(row.PartyId)}
          style={{ cursor: 'pointer' }}
          sx={{ 
            '& > td': { 
              padding: '2px 14px 2px 19px',
            }
          }}
        >
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell key={column.id} align={column.align}>
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      );
    })}
</TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}


