'use client';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
// components
import SalesOverview from '@/app/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/components/dashboard/ProductPerformance';
import Blog from '@/app/components/dashboard/Blog';
import MonthlyEarnings from '@/app/components/dashboard/MonthlyEarnings';
import { useEffect, useState } from 'react';
import BASE_URL from '@/utils/api'; 
import axios from 'axios';
import { Card, CardContent, Typography, Avatar} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';

export default function Dashboard() {
  const [allUsers, setAllUsers] = useState()
  const [userCount, setUserCount] = useState('')
  const [userAndroid, setUserAndroid] = useState('')
  const [userIOS, setUserIOS] = useState('')
  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = user?.data?.adminToken;
  useEffect(() => {
    if (!token) return; 

    const fetchUsers = async () => {
      try {
        const config = {
      headers: {
        'x-access-token': token, 
      },
    };

        const [countUsers, androidUsers ,iosUsers] = await Promise.all([
          axios.get(`${BASE_URL}/admin/content/countUsers`, config),
          axios.get(`${BASE_URL}/admin/content/androidUsers`, config),
          axios.get(`${BASE_URL}/admin/content/iosUsers`, config),
        ]);
        setUserCount(countUsers.data.data);
        setUserAndroid(androidUsers.data.data);
        setUserIOS(iosUsers.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [token]);

  console.log("data" , userCount,userAndroid,userIOS )



  
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
  <Box mt={3}>
    <Grid container spacing={3}>
      
      {/* Total Users */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 3, minHeight: 160, backgroundColor: '#f5f5f5' }} elevation={4}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#616161', mr: 3, width: 60, height: 60 }}>
              <PeopleIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Users</Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600 , mt:0.5 }}>{userCount}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Android Users */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 3, minHeight: 160, backgroundColor: '#e8f5e9' }} elevation={4}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4caf50', mr: 3, width: 60, height: 60 }}>
              <AndroidIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>Android Users</Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600 , mt:0.5}}>{userAndroid}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* iOS Users */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 3, minHeight: 160, backgroundColor: '#e3f2fd' }} elevation={4}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2196f3', mr: 3, width: 60, height: 60 }}>
              <AppleIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>iOS Users</Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600 , mt:0.5}}>{userIOS}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  </Box>
</PageContainer>

  );
}
