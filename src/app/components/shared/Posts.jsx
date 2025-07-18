'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const CreatePost = () => {
    const [interests, setInterests] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [getPosts, setGetPosts] = useState(true);
    const [posts, setPosts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [updateImageFile, setUpdateImageFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [viewPost, setViewPost] = useState(null); // for View functionality

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    



    const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
    const token = user?.data?.adminToken;

    useEffect(() => {
        fetchInterests();
        fetchPosts();
    }, []);

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

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/admin/blog/getAllPosts`, {
                headers: { 'x-access-token': token },
            });
            if (res.data.success) {
                setPosts(res.data.data);
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
                `${BASE_URL}/admin/blog/createPost/${selectedInterest}`,
                formData,
                {
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data.success) {
                setMessage('✅ Post created successfully');
                setPostTitle('');
                setPostContent('');
                setImageFile(null);
                setSelectedInterest('');
                setShowAddModal(false);
                fetchPosts()
            } else {
                setMessage('❌ Something went wrong');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Submission failed');
        }
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!currentPost?.id) return;

        const formData = new FormData();
        formData.append('postTitle', updateTitle);
        formData.append('postContent', updateContent);
        if (updateImageFile) formData.append('image', updateImageFile);
        setIsUpdating(true);

        try {
            const res = await axios.put(
                `${BASE_URL}/admin/blog/updatePost/${currentPost.id}`,
                formData,
                {
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.data.success) {
                setMessage('✅ Post updated successfully');
                setShowUpdateModal(false);
                fetchPosts(); // refresh
            } else {
                setMessage(' Update failed');
            }
        } catch (err) {
            console.error(err);
            setMessage(' Update error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await axios.delete(`${BASE_URL}/admin/blog/deletePost/${postId}`, {
                headers: { 'x-access-token': token },
            });
            if (res.data.success) {
                setMessage('🗑️ Post deleted');
                fetchPosts(); // refresh
            } else {
                setMessage('❌ Delete failed');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Delete error');
        }
    };


    return (
        <div style={{ maxWidth: 950, margin: 'auto' }}>
            <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                 <h1>User Posts</h1>

            <button
                onClick={() => setShowAddModal(true)}
                className='addBtn'
            >
                Create Post
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
                        backgroundColor: 'white',
                        padding: 30,
                        borderRadius: 8,
                        width: '90%',
                        maxWidth: 600,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <h2>Create Blog Post</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <input
                                type="text"
                                placeholder="Post Title"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                required
                                style={{
                                    padding: 10,
                                    borderRadius: 4,
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />

                            <textarea
                                placeholder="Post Content"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
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
                                    Create Post
                                </button>
                            </div>
                        </form>

                        {/* {message && <p style={{ marginTop: 20 }}>{message}</p>} */}
                    </div>
                </div>
            )}

            {/* Posts display */}
           {viewPost ? (
  <div className='primaryColor' style={{ marginTop: 20, maxWidth: '800px', margin: 'auto', padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.7)', borderRadius: 8 }}>
    <h1>{viewPost.title}</h1>
    <img src={viewPost.image} alt="Post" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
    <p>{viewPost.content}</p>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
     <p><strong>Interest:</strong> {viewPost.category?.name}</p>
    <button className='canclenbtn' onClick={() => setViewPost(null)}>Back to Table</button>
    </div>
  </div>
) : (
  <TableContainer component={Paper} className='primaryColor' sx={{ mt: 2, maxWidth:'950px', margin: 'auto' , boxShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>
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
                <IconButton onClick={() => setViewPost(post)} color="primary">
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setCurrentPost(post);
                    setUpdateTitle(post.title);
                    setUpdateContent(post.content);
                    setShowUpdateModal(true);
                  }}
                  color="secondary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeletePost(post.id)} color="error">
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
            {showUpdateModal && currentPost && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 999,
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: 30, borderRadius: 8,
                        width: '90%', maxWidth: 600, boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <h2>Update Post</h2>
                        <form onSubmit={handleUpdatePost} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
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
                                    ) : 'Update Post'}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CreatePost;
