import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, IconButton, Box, AppBar, Toolbar, Avatar
} from '@mui/material';
import { Edit, Delete, Receipt, Logout } from '@mui/icons-material';
import { apiUrl } from "../Config";

export default function Home() {
  const navigate = useNavigate(); 
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', designation: '', department: '', employeeNumber: '',
    companyName: '', baseSalary: '', increment: '', da: '',
    hra: '', specialAllowance: '', address: '', phoneNumber: '',
    email: '', dateOfBirth: '', dateOfJoining: ''
  });

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${apiUrl}`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setEditing(false);
    setFormData({
      name: '', designation: '', department: '', employeeNumber: '',
      companyName: '', baseSalary: '', increment: '', da: '',
      hra: '', specialAllowance: '', address: '', phoneNumber: '',
      email: '', dateOfBirth: '', dateOfJoining: ''
    });
    setOpen(true);
  };

  const handleSalarySlipClick = async (employeeNumber) => {
    navigate(`/salary-slip/${employeeNumber}`);
  };

  const handleEditClick = async (employeeNumber) => {
    try {
      const res = await axios.get(`${apiUrl}/${employeeNumber}`);
      setFormData(res.data);
      setEditing(true);
      setOpen(true);
    } catch (err) {
      console.error('Error fetching employee for edit:', err);
    }
  };

  const handleDeleteClick = async (employeeNumber) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${apiUrl}/${employeeNumber}`);
        setOpen(false); // Close the dialog if open
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`${apiUrl}/${formData.employeeNumber}`, {
          baseSalary: Number(formData.baseSalary),
          increment: Number(formData.increment),
          da: Number(formData.da),
          hra: Number(formData.hra),
          specialAllowance: Number(formData.specialAllowance),
        });
      } else {
        await axios.post(`${apiUrl}/employee`, formData);
      }
      setOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error submitting employee:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* User Info and Logout */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>{user.name ? user.name[0] : ''}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>Employee Directory</Typography>
          <Button variant="contained" color="primary" onClick={handleAddClick}>
            Add New Employee
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Emp Id</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Total Earnings</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.employeeNumber}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phoneNumber}</TableCell>
                  <TableCell>{emp.totalEarnings}</TableCell>
                  <TableCell align="center">
                    <IconButton color="success" onClick={() => handleSalarySlipClick(emp.employeeNumber)}>
                      <Receipt />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEditClick(emp.employeeNumber)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(emp.employeeNumber)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Employee Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            {editing ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.keys(formData).map((key) => (
                <TextField
                  key={key}
                  margin="dense"
                  label={key.replace(/([A-Z])/g, ' $1')}
                  name={key}
                  type={['baseSalary', 'increment', 'da', 'hra', 'specialAllowance'].includes(key) ? 'number' : 'text'}
                  fullWidth
                  variant="filled"
                  value={formData[key]}
                  onChange={handleChange}
                  disabled={editing && key === 'employeeNumber'}
                  sx={{ flex: '1 1 45%', minWidth: 180 }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editing ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}