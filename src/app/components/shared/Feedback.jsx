'use client';
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import BASE_URL from '@/utils/api';
import { Alert, Snackbar } from "@mui/material";
import { CustomizerContext } from '@/app/context/customizerContext';

function Feedback() {
     const [feedbacks , setFeedbacks] = useState([]);

     const [token , setToken] = useState(null);
        useEffect(() => {
          const USER = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
          setUser(USER);
          setToken(USER?.data?.adminToken || null);
        }, []);
      // const token = user?.data?.adminToken;
      console.log('token' , token)
            const { activeMode } = useContext(CustomizerContext);
            
            const backgroundColor = activeMode === 'dark' ? '#1e1e2f' : '#ffffff';
            const textColor = activeMode === 'dark' ? '#ffffff' : '#000000';
    
      useEffect(() => {
      if (token) {
        fetchFeedbacks();
      }
    }, [token]);

    const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/post/userFeedBack`, {
        headers: { 'x-access-token': token },
      });
      if (res.data.success) {
        setFeedbacks(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch Feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log('feedbacks', feedbacks)




  return (
    <div>Feedback</div>
  )
}

export default Feedback