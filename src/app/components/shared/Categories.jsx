'use client';
import React, { useEffect, useState, useContext } from 'react';
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



const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState('');
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/blogRequestCategory/getRequestPostCategory`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${BASE_URL}/admin/blogRequestCategory/createRequestPostCategory`, {
        postRequestCategory: newCategory,
      }, {
        headers: { 'x-access-token': token },
      });
      setNewCategory('');
      setShowAddModal(false);
      fetchCategories();
      setFeedback({ message: 'Category created successfully!', success: true, open: true });
    } catch (err) {
      console.error("Create error:", err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to create Category',
        success: false,
        open: true,
      });
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/blogRequestCategory/deleteRequestPostCategory/${id}`, {
        headers: { 'x-access-token': token },
      });
      fetchCategories();
      setFeedback({ message: 'Category delete successfully!', success: true, open: true });
    } catch (err) {
      console.error("Delete error:", err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to Delete Category',
        success: false,
        open: true,
      });
    }
  };

  const openEditModal = (cat) => {
    setEditCategory(cat.name);
    setEditId(cat.id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const updateCategory = async () => {
    if (!editCategory.trim() || !editId) return;
    try {
      await axios.put(`${BASE_URL}/admin/blogRequestCategory/updateRequestPostCategory/${editId}`, {
        postRequestCategory: editCategory,
      }, {
        headers: { 'x-access-token': token },
      });
      setShowModal(false);
      setEditId(null);
      setEditCategory('');
      fetchCategories();
      setFeedback({ message: 'Category Updated successfully!', success: true, open: true });

    } catch (err) {
      console.error("Update error:", err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to update Category',
        success: false,
        open: true,
      });
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 700 , margin: 'auto' }}>
      <h1>Post Categories</h1>

   <div style={{ display: 'flex', marginBottom: 20 }}>
       <div style={{ position: 'relative', flex: 1, marginRight: 10 }}>
         <input
           type="text"
           placeholder="Search for interest"
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
       <button onClick={openAddModal} className="addBtn">
         Add a Category
       </button>
     </div>
   
     {/* Table */}
     <TableContainer
       component={Paper}
       sx={{
         boxShadow: '0 2px 4px rgba(0,0,0,0.7)',
       }}
     >
       <Table>
         <TableHead>
           <TableRow>
             <TableCell><strong>S.no</strong></TableCell>
             <TableCell><strong>Name</strong></TableCell>
             <TableCell align="right"><strong>Actions</strong></TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {filteredCategories
             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             .map((item,index) => (
               <TableRow key={item.id}>
                 <TableCell>{index+1}</TableCell>
                 <TableCell>{item.name}</TableCell>
                 <TableCell align="right">
                   <IconButton onClick={() => openEditModal(item)} color="secondary">
                     <EditIcon />
                   </IconButton>
                   <IconButton onClick={() => deleteCategory(item.id)} color="error">
                     <DeleteIcon />
                   </IconButton>
                 </TableCell>
               </TableRow>
             ))}
         </TableBody>
       </Table>
       <TablePagination
         component="div"
         count={filteredCategories.length}
         page={page}
         onPageChange={handleChangePage}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleChangeRowsPerPage}
         rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
       />
     </TableContainer>
      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: backgroundColor, padding: 20, borderRadius: 8, minWidth: 300,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}>
            <h3>Edit Category</h3>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 10,
                borderRadius: 4,
                border: '#c5bdbdff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginRight: 10,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={updateCategory}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%',
          height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: backgroundColor, padding: 20, borderRadius: 8, minWidth: 300,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}>
            <h3>Add New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                marginBottom: 10,
                borderRadius: 4,
                border: '#c5bdbdff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginRight: 10,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={createCategory}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </div>
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

export default Categories;
