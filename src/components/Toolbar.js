import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AppToolbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          YouTube Çekiliş
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
