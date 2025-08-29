"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(DashboardLayout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { CustomizerContext } from '@/app/context/customizerContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import "@/utils/i18n";
import "../app/global.css";
import 'react-quill/dist/quill.snow.css';

const MyApp = ({ children }) => {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
    const isLoginPage = pathname.startsWith('/auth/auth1/login');

    if (!user && !isLoginPage) {
      setLoading(true); // Start loading
      setTimeout(() => {
        router.replace('/auth/auth1/login');
      }, 1000); // Delay the redirect by 1 second
    } else {
      setLoading(false); // Stop loading if user is found or on login page
    }
  }, [pathname, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading screen or spinner
  }

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <RTL direction={activeDir}>
          <CssBaseline />
          {children}
        </RTL>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
