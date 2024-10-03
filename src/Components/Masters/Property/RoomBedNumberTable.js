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

const columns = [
  { id: 'roomId', label: 'Room No', minWidth: 100 },
  { id: 'roombedName', label: 'Roombed No', minWidth: 170 },
  { id: 'remark', label: 'Remark', minWidth: 170 }
];

export default function RoomBedNumberTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerms, setSearchTerms] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomBedNumberData();
  }, []);

  const fetchRoomBedNumberData = async () => {
    try {
      const response = await axios.post('http://43.230.196.21/api/RoomBedMst/getAllRoomBedMstDashBoard', {
        start: 0,
        PageSizea: 0,
        SearchText: ""
      });
      
      if (response.data.status === 0) {
        const formattedData = response.data.data.map(Roombed => ({
          ...Roombed,
          roomId: Roombed.roomId,
          roombedName: Roombed.roombedName || '', 
          remark: Roombed.remark
        }));
        setRows(formattedData);
        console.log('resp', response);
      } else {
        console.error('Error fetching Roombed Number data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching Roombed Number data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate('/roomBedNumber');
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

  const handleRowDoubleClick = (roomBedId) => {
  
    navigate('/roomBedNumber', { state: { roomBedId ,mode: 'view'}} );
  };

  const handleLocationclick=()=>{
    navigate('/masters/property')
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
            <Typography color="text.primary" onClick={handleLocationclick} sx={{cursor:'pointer'}}>Property</Typography>

            <Typography color="text.primary">RoomBedNumber Master</Typography>

          </Breadcrumbs>

          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              backgroundColor: '#7c3aed ',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7c3aed ',
              },
              // margin: '0 56px 0 0'
            }}
          >
            Add New Record
          </Button>
        </Box>
        <Paper sx={{ width: '50%', overflow: 'hidden', margin: '0px 0px 0px 50px', border:'1px solid lightgray' }}>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow
                  sx={{ 
                    '& > th': { 
                      padding: '2px  10px 2px  10px'
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
                          width: '151px'
                        },}}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.roomBedId}
                      onDoubleClick={() => handleRowDoubleClick(row.roomBedId)}
                      style={{ cursor: 'pointer' }}
                      sx={{ 
                        '& > td': { 
                          padding: '2px  14px 2px  10px'
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
            rowsPerPageOptions={[15, 20, 25, 100]}
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