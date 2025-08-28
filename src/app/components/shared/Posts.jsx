'use client';
import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomizerContext } from '@/app/context/customizerContext';


const Createpost = () => {
    const [interests, setInterests] = useState([]);
    const [postTitle, setpostTitle] = useState('');
    const [postContent, setpostContent] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [getposts, setGetposts] = useState(true);
    const [posts, setposts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentpost, setCurrentpost] = useState(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [updateImageFile, setUpdateImageFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [viewpost, setViewpost] = useState(null); // for View functionality
    const [feedback, setFeedback] = useState({ message: '', success: true, open: false });
        const { activeMode } = useContext(CustomizerContext);
      
        const backgroundColor = activeMode === 'dark' ? '#1e1e2f' : '#ffffff';
        const textColor = activeMode === 'dark' ? '#ffffff' : '#000000';

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [user , setUser] = useState();
      useEffect(() => {
        const USER = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
        setUser(USER);
      }, []);
    const token = user?.data?.adminToken;

    useEffect(() => {
        if (token) {
            fetchInterests();
            fetchposts();
        }
    }, [token]);

    const fetchInterests = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/admin/interest/getUserInterest`, {
                headers: { 'x-access-token': token },
            });
            if (res.data.success) {
                setInterests(res.data.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchposts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/admin/post/getAllPosts`, {
                headers: { 'x-access-token': token },
            });
            if (res.data.success) {
                setposts(res.data.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInterest || !postTitle || !postContent || !imageFile) {
            setMessage('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('postTitle', postTitle);
        formData.append('postContent', postContent);
        formData.append('image', imageFile);

        try {
            const res = await axios.post(
                `${BASE_URL}/admin/post/createPost/${selectedInterest}`,
                formData,
                {
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data.success) {
                setMessage('✅ post created successfully');
                setpostTitle('');
                setpostContent('');
                setImageFile(null);
                setSelectedInterest('');
                setShowAddModal(false);
                fetchposts()
      setFeedback({ message: 'post created successfully!', success: true, open: true });

            } else {
                setMessage('❌ Something went wrong');
                setFeedback({
        message: err?.response?.data?.message || 'Failed to create post',
        success: false,
        open: true,
      });
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Submission failed');
            setFeedback({
        message: err?.response?.data?.message || 'Failed to create post',
        success: false,
        open: true,
      });
        }
    };

    const handleUpdatepost = async (e) => {
        e.preventDefault();
        if (!currentpost?.id) return;

        const formData = new FormData();
        formData.append('postTitle', updateTitle);
        formData.append('postContent', updateContent);
        if (updateImageFile) formData.append('image', updateImageFile);
        setIsUpdating(true);

        try {
            const res = await axios.put(
                `${BASE_URL}/admin/post/updatePost/${currentpost.id}`,
                formData,
                {
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.data.success) {
                setMessage('✅ post updated successfully');
                setShowUpdateModal(false);
                fetchposts(); // refresh
      setFeedback({ message: 'post update successfully!', success: true, open: true });

            } else {
                setMessage(' Update failed');
                setFeedback({
        message: err?.response?.data?.message || 'Failed to update post',
        success: false,
        open: true,
      });
            }
        } catch (err) {
            console.error(err);
            setMessage(' Update error');
            setFeedback({
        message: err?.response?.data?.message || 'Failed to update post',
        success: false,
        open: true,
      });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletepost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await axios.delete(`${BASE_URL}/admin/post/deletePost/${postId}`, {
                headers: { 'x-access-token': token },
            });
            if (res.data.success) {
                setMessage('🗑️ post deleted');
                fetchposts(); // refresh
      setFeedback({ message: 'post deleted successfully!', success: true, open: true });

            } else {
                setMessage('❌ Delete failed');
                setFeedback({
        message: err?.response?.data?.message || 'Failed to delete post',
        success: false,
        open: true,
      });
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Delete error');
            setFeedback({
        message: err?.response?.data?.message || 'Failed to delete post',
        success: false,
        open: true,
      });
        }
    };


    return (
        <div style={{ maxWidth: 950, margin: 'auto' }}>
            <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                 <h1>User posts</h1>

            <button
                onClick={() => setShowAddModal(true)}
                className='addBtn'
            >
                Create post
            </button>

            </div>
           

            {/* Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                }}>
                    <div style={{
                        backgroundColor: backgroundColor,
                        padding: 30,
                        borderRadius: 8,
                        width: '90%',
                        maxWidth: 600,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <h2>Create Post</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <input
                                type="text"
                                placeholder="post Title"
                                value={postTitle}
                                onChange={(e) => setpostTitle(e.target.value)}
                                required
                                style={{
                                    padding: 10,
                                    borderRadius: 4,
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />

                            <textarea
                                placeholder="post Content"
                                value={postContent}
                                onChange={(e) => setpostContent(e.target.value)}
                                rows={6}
                                required
                                style={{
                                    padding: 10,
                                    borderRadius: 4,
                                    border: '1px solid #ccc',
                                    resize: 'vertical',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                required
                            />

                            <select
                                value={selectedInterest}
                                onChange={(e) => setSelectedInterest(e.target.value)}
                                required
                                style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                            >
                                <option value="">Select an Interest</option>
                                {interests.map((interest) => (
                                    <option key={interest.id} value={interest.id}>
                                        {interest.name}
                                    </option>
                                ))}
                            </select>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        padding: '10px 16px',
                                        backgroundColor: '#ccc',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        padding: '10px 16px',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Create post
                                </button>
                            </div>
                        </form>

                        {/* {message && <p style={{ marginTop: 20 }}>{message}</p>} */}
                    </div>
                </div>
            )}

            {/* posts display */}
           {viewpost ? (
  <div  style={{ marginTop: 20, maxWidth: '800px', margin: 'auto', padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.7)', borderRadius: 8 }}>
    <h1>{viewpost.title}</h1>
    <img src={viewpost.image} alt="post" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
    <p>{viewpost.content}</p>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
     <p><strong>Interest:</strong> {viewpost.category?.name}</p>
    <button className='canclenbtn' onClick={() => setViewpost(null)}>Back to Table</button>
    </div>
  </div>
) : (
  <TableContainer component={Paper}  sx={{ mt: 2, maxWidth:'950px', margin: 'auto' , boxShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Image</TableCell>
          <TableCell>Interest</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {posts
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                <img
                  src={post.image}
                  alt="thumbnail"
                  style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
                />
              </TableCell>
              <TableCell>{post.category?.name}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => setViewpost(post)} color="primary">
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setCurrentpost(post);
                    setUpdateTitle(post.title);
                    setUpdateContent(post.content);
                    setShowUpdateModal(true);
                  }}
                  color="secondary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeletepost(post.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    <TablePagination
      component="div"
      count={posts.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[4, 10, 15,20,50,100]}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TableContainer>
)}



            {/* Update Modal */}
            {showUpdateModal && currentpost && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 999,
                }}>
                    <div style={{
                        backgroundColor: backgroundColor, padding: 30, borderRadius: 8,
                        width: '90%', maxWidth: 600, boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <h2>Update post</h2>
                        <form onSubmit={handleUpdatepost} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <input
                                type="text"
                                value={updateTitle}
                                onChange={(e) => setUpdateTitle(e.target.value)}
                                placeholder="Title"
                                required
                                style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                            <textarea
                                rows={6}
                                value={updateContent}
                                onChange={(e) => setUpdateContent(e.target.value)}
                                placeholder="Content"
                                required
                                style={{ padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUpdateImageFile(e.target.files[0])}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    style={{ padding: '10px 16px', backgroundColor: '#ccc', borderRadius: 4, border: 'none', cursor: 'pointer', }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="updateBtn"
                                    disabled={isUpdating}
                                    style={{
                                        padding: '10px 16px',
                                        backgroundColor: isUpdating ? '#999999' : '#007bff',
                                        color: 'white',
                                        borderRadius: 4,
                                        border: 'none',
                                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                    }}
                                >
                                    {isUpdating ? (
                                        <span style={{
                                            border: '3px solid #f3f3f3',
                                            borderTop: '3px solid white',
                                            borderRadius: '50%',
                                            width: 16,
                                            height: 16,
                                            animation: 'spin 1s linear infinite',
                                        }} />
                                    ) : 'Update post'}
                                </button>

                            </div>
                        </form>
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

export default Createpost;
