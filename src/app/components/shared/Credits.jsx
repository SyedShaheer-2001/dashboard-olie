'use client';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { CustomizerContext } from '@/app/context/customizerContext';


const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [newCredit, setNewCredit] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editCredit, setEditCredit] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    const [feedback, setFeedback] = useState({ message: '', success: true, open: false });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
    const { activeMode } = useContext(CustomizerContext);
  
    const backgroundColor = activeMode === 'dark' ? '#1e1e2f' : '#ffffff';
    const textColor = activeMode === 'dark' ? '#ffffff' : '#000000';

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCredits = credits.filter((item) =>
    item.credit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [user , setUser] = useState();
    useEffect(() => {
      const USER = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
      setUser(USER);
    }, []);
  const token = user?.data?.adminToken;

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/credit/showCredit`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) {
        setCredits(res.data.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const createCredit = async () => {
    if (!newCredit || !newAmount) return;
    try {
      await axios.post(`${BASE_URL}/admin/credit/createCredit`, {
        credit: newCredit,
        amount: parseFloat(newAmount),
      }, {
        headers: { 'x-access-token': token },
      });
      setNewCredit('');
      setNewAmount('');
      setShowAddModal(false);
      fetchCredits();
      setFeedback({ message: 'Credits created successfully!', success: true, open: true });
    } catch (err) {
      console.error('Create error:', err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to create Credits',
        success: false,
        open: true,
      });
    }
  };

  const updateCredit = async () => {
    if (!editCredit || !editAmount || !editId) return;
    try {
      await axios.put(`${BASE_URL}/admin/credit/updateCredit/${editId}`, {
        credit: editCredit,
        amount: parseFloat(editAmount),
      }, {
        headers: { 'x-access-token': token },
      });
      setShowModal(false);
      setEditId(null);
      setEditCredit('');
      setEditAmount('');
      fetchCredits();
      setFeedback({ message: 'Credits update successfully!', success: true, open: true });

    } catch (err) {
      console.error('Update error:', err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to update Credits',
        success: false,
        open: true,
      });
    }
  };

  const deleteCredit = async (id) => {
    if (!confirm('Are you sure you want to delete this credit?')) return;
    try {
      await axios.delete(`${BASE_URL}/admin/credit/deleteCredit/${id}`, {
        headers: { 'x-access-token': token },
      });
      fetchCredits();
      setFeedback({ message: 'Credit deleted successfully!', success: true, open: true });
    } catch (err) {
      console.error('Delete error:', err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to delete Credit',
        success: false,
        open: true,
      });
    }
  };

  const openEditModal = (item) => {
    setEditCredit(item.credit);
    setEditAmount(item.amount);
    setEditId(item.id);
    setShowModal(true);
  };

  const inputStyle = {
  width: '100%',
  padding: 8,
  marginBottom: 10,
  borderRadius: 4,
  border: '#c5bdbdff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
  outline: 'none'
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
  alignItems: 'center', justifyContent: 'center'
};

const modalContentStyle = {
  backgroundColor: backgroundColor, padding: 20, borderRadius: 8, minWidth: 300,
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
};

const ModalButtons = ({ onCancel, onSave }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <button onClick={onCancel} style={buttonStyle('#6c757d')}>Cancel</button>
    <button onClick={onSave} style={buttonStyle('#28a745')}>Save</button>
  </div>
);

const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 4,
  marginLeft: 10,
  cursor: 'pointer',
});


  return (
    <div style={{ padding: 20, maxWidth: 700, margin: 'auto' }}>
      <h1>Credits</h1>

      <div style={{ display: 'flex', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, marginRight: 10 }}>
          <input
            type="text"
            placeholder="Search credit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 40px 16px 16px',
              borderRadius: 4,
              border: '1px solid #c5bdbdff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
              outline: 'none',
              fontSize: '16px',
            }}
          />
          <SearchIcon
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'gray',
            }}
          />
        </div>
        <button onClick={() => setShowAddModal(true)} className="addBtn">Add Credit</button>
      </div>

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.7)',  }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>S.no</strong></TableCell>
              <TableCell><strong>Credit</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCredits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item,index) => (
                <TableRow key={item.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{item.credit}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEditModal(item)} color="secondary"><EditIcon /></IconButton>
                    <IconButton onClick={() => deleteCredit(item.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCredits.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        />
      </TableContainer>

      {/* Edit Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} >
            <h3>Edit Credit</h3>
            <input value={editCredit} onChange={(e) => setEditCredit(e.target.value)} placeholder="Credit" style={inputStyle} />
            <input value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="Amount" style={inputStyle} />
            <ModalButtons onCancel={() => setShowModal(false)} onSave={updateCredit} />
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Add New Credit</h3>
            <input value={newCredit} onChange={(e) => setNewCredit(e.target.value)} placeholder="Credit" style={inputStyle} />
            <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount" style={inputStyle} />
            <ModalButtons onCancel={() => setShowAddModal(false)} onSave={createCredit} />
          </div>
        </div>
      )}

      <Snackbar
              open={feedback.open}
              autoHideDuration={3000}
              onClose={() => setFeedback({ ...feedback, open: false })}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity={feedback.success ? 'success' : 'error'}>
                {feedback.message}
              </Alert>
            </Snackbar>
    </div>
  );
};




export default Credits;
