'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import AuthSocialButtons from "./AuthSocialButtons";
import React, {useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BASE_URL from '@/utils/api'; 


const AuthLogin = ({ title, subtitle, subtext }) => {
const [email, setUsername] = useState('');
const [password, setPassword] = useState('');

const router = useRouter();



const handleLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/auth/adminLogin`, {
      email,
      password,
    });

    if (response.status === 200) {
      console.log('Login successful:', response.data);
      router.push('/'); 
       sessionStorage.setItem('user', JSON.stringify(response.data));
    }
  } catch (error) {
    if (error.response) {
      console.error('Login failed:', error.response.data.message || error.message);
    } else {
      console.error('Network/API error:', error.message);
    }
  }
};


  return (
    <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
        <CustomTextField 
        id="username" 
        variant="outlined"
         fullWidth
         value={email}
  onChange={(e) => setUsername(e.target.value)}
         />
      </Box>
      <Box>
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField
          id="password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
         />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        
        
      </Stack>
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
  onClick={handleLogin}
      >
        Sign In
      </Button>
    </Box> 
  </>

  )
  
};


export default AuthLogin;
