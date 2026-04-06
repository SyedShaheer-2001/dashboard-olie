'use client';
import { useContext } from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import { CustomizerContext } from '@/app/context/customizerContext';

const Customizer = () => {
  const { activeMode, setActiveMode } = useContext(CustomizerContext);

  const handleToggleTheme = () => {
    setActiveMode(activeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip title={activeMode === 'light' ? 'Light Mode' : 'Dark Mode'}>
      <Fab
        color="primary"
        aria-label="theme toggle"
        sx={{ position: 'fixed', right: '25px', bottom: '15px' }}
        onClick={handleToggleTheme}
      >
        {activeMode === 'light' ? (
          <WbSunnyTwoToneIcon />
        ) : (
          <DarkModeTwoToneIcon />
        )}
      </Fab>
    </Tooltip>
  );
};

export default Customizer;