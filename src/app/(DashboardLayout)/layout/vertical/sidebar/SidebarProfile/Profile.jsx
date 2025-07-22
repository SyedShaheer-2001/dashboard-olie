'use client'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useContext, useEffect, useState } from 'react';
import { CustomizerContext } from "@/app/context/customizerContext";
import { IconPower } from '@tabler/icons-react';
import Link from 'next/link';

export const Profile = () => {
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == 'mini-sidebar' && !isSidebarHover : '';
  const [user , setUser] = useState();
  useEffect(() => { 
     const user = JSON.parse(sessionStorage.getItem('user'));
     setUser(user);
  }, []);
   const myImage = typeof window !== 'undefined' ? localStorage.getItem('myImage') : null;

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('myImage');
    window.location.href = '/auth/auth1/login';
  };



  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          {/* <Avatar alt="Remy Sharp" src={myImage} sx={{ height: 40, width: 40 }} /> */}

          <Box>
            <Typography variant="h6">{user?.data?.name || "Wilson"} </Typography>
            <Typography variant="caption">{user?.data?.userType}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                component={Link}
                href="/auth/auth1/login"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
