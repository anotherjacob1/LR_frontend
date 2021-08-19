import React from 'react';
import { SnackbarProvider } from 'notistack';

const StyledSnackbarProvider: React.FC = ({ children }) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      maxSnack={4}
    >
      {children}
    </SnackbarProvider>
  );
};

export default StyledSnackbarProvider;
