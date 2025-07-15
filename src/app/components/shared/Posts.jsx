'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';

const CreatePost = () => {
    const [interests, setInterests] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [selectedInterest, setSelectedInterest] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [getPosts, setGetPosts] = useState(true);
    const [posts, setPosts] = useState([]);

    const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
    const token = user?.data?.adminToken;

    useEffect(() => {
        fetchInterests();
        fetchPosts();
    }, [getPosts]);

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
            } else {
                setMessage('❌ Something went wrong');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Submission failed');
        }
    };

    return (
        <div>
            <h1>User Posts</h1>
            <button
                onClick={() => setGetPosts(prev => !prev)}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                {getPosts ? 'Create Posts' : 'Show Posts'}
            </button>
            {getPosts ? (
                <div style={{ padding: 20, maxWidth: 700, textAlign: 'left' }}>
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

                        <button
                            type="submit"
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                            }}
                        >
                            Create Post
                        </button>
                    </form>

                    {message && <p style={{ marginTop: 20 }}>{message}</p>}
                </div>
            )
                :
                (
                    <>
                        {
                            posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id} style={{ marginBottom: 20, padding: 20, border: '1px solid #ddd', borderRadius: 4, marginTop: 10 }}>
                                        <h3>{post?.title}</h3>
                                        <p>{post?.content}</p>
                                        {post?.image && <img src={post.image} alt="Post" style={{ maxWidth: '100%' }} />}
                                        <p><strong>Interest:</strong> {post?.category?.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )
                        }
                    </>


                )}
        </div>
    );
};

export default CreatePost;
