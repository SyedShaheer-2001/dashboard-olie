import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import Notifications from "./Notification";
import Profile from "./Profile";
import Search from "./Search";
import Language from "./Language";
import Navigation from "./Navigation";
import MobileRightSidebar from "./MobileRightSidebar";
import { useContext } from "react";
import config from '@/app/context/config'
import { CustomizerContext } from '@/app/context/customizerContext';


const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { activeMode, setActiveMode, setIsCollapse, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const TopbarHeight = config.topbarHeight;


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => {
            if (lgUp) {
              isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
            } else {
              setIsMobileSidebar(!isMobileSidebar);
            }
          }
          }
        >
          <IconMenu2 size="20" />
        </IconButton>

        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          

          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}

          
          {/* <Notifications /> */}
          {/* ------------------------------------------- */}
          {/* Toggle Right Sidebar for mobile */}
          {/* ------------------------------------------- */}
          
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
