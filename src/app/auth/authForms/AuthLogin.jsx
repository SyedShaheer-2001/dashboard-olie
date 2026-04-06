'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import BASE_URL from '@/utils/api';
import axios from 'axios';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();


const handleLogin = async () => {
  try {
    setLoading(true);

    const response = await axios.post(`${BASE_URL}/admin/auth/adminLogin`, {
      email,
      password,
    });

    if (response.status === 200) {
      console.log("Login successful:", response.data);

      // ✅ Save session
      sessionStorage.setItem("user", JSON.stringify(response.data));

      router.push("/");
    }
  } catch (error) {
    if (error.response) {
      setMessage(error.response.data.message || "Login failed. Please try again.");
    } else {
      setMessage("Network error. Please check your connection and try again.");
    }
  } finally {
    setLoading(false);
  }
};
console.log( 'main console',JSON.parse(sessionStorage.getItem("user")));

 
  return (
  <>
    <div style={{textAlign:'center'}}>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

    </div>
      

      <Stack spacing={1}>
        <Box>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {message && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </Stack>

      <Box mt={4}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Box>
    </>
  )
  
};


export default AuthLogin;
