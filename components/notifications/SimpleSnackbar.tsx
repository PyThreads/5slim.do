import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { DownImageSnack, ErrorIconSnack } from '../icons/Svg';
import { INotify } from '../../api/src/interfaces';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

export default function SimpleSnackbar({ type, message, title, open, setOpen, delay = 6000 }: INotify) {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') return;
    setOpen();
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={delay}
      onClose={handleClose}
      sx={{ mt: 1 }}
    >
      <Box
        sx={{
          width: 348,
          backgroundColor: type === "success" ? "#4E8D7C" : "#F64B3C",
          borderRadius: 5,
          p: 1.5,
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >

        <Box position="absolute" top={-30} left={14}>
          <ErrorIconSnack filled color={type === "success" ? "#396559" : "#C81912"} type={type} />
        </Box>

        <Box position="absolute" bottom={-4} left={0}>
          <DownImageSnack filled color={type === "success" ? "#396559" : "#C81912"} />
        </Box>


        <Box flexGrow={1} pr={4} ml={6} mt={1}>
          <Typography fontFamily={ inter.style.fontFamily} fontSize="18px" color="#FFFFFF" fontWeight={400} mb={0.5}>
            {title}
          </Typography>
          <Typography fontFamily={ inter.style.fontFamily} fontSize="13px" color="#FFFFFF">
            {message}
          </Typography>
        </Box>

        {/* Botón de cerrar */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setOpen();
          }}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
            zIndex: 1,
          }}
        >
          <CloseIcon sx={{ fontSize: "20px", fontWeight: "bold",color:"black" }} />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
