import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // This logic relies on the idx property managed by React Router's history instance.
    const updateNavState = () => {
      const { state } = window.history;
      const hasStateIdx = state && typeof state.idx === 'number';
      
      setCanGoBack(hasStateIdx && state.idx > 0);
      setCanGoForward(hasStateIdx && state.idx < window.history.length - 1);
    };

    // React Router might push to history asynchronously. A small delay helps ensure
    // window.history has updated before we check it.
    const timerId = setTimeout(updateNavState, 100);

    // Also listen for the browser's native back/forward events
    window.addEventListener('popstate', updateNavState);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('popstate', updateNavState);
    };
  }, [location]); // Re-evaluate whenever the route changes

  return (
    <Box sx={{ backgroundColor: (theme) => theme.navigation.backgroundColor }}>
      <IconButton
        sx={{
          color: (theme) => theme.navigation.iconColor,
          opacity: canGoBack ? 1 : 0.4,
          cursor: canGoBack ? 'pointer' : 'not-allowed',
        }}
        onClick={() => canGoBack && navigate(-1)}
        disabled={!canGoBack}
      >
        <ArrowBackOutlinedIcon />
      </IconButton>
      <IconButton
        sx={{
          color: (theme) => theme.navigation.iconColor,
          opacity: canGoForward ? 1 : 0.4,
          cursor: canGoForward ? 'pointer' : 'not-allowed',
        }}
        onClick={() => canGoForward && navigate(1)}
        disabled={!canGoForward}
      >
        <ArrowForwardOutlinedIcon />
      </IconButton>
    </Box>
  );
}

export default Navigation;