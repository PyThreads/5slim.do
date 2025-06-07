import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { DownImageSnack, ErrorIconSnack } from '../icons/Svg';
import { INotify } from '../../api/src/interfaces';

export default function SimpleSnackbar({ type, message, title, open, setOpen }: INotify) {

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen()

  };



  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={handleClose}
      sx={{
        mt: 1
      }}
    >
      <Box
        sx={{
          width: 348,
          height: "95px",
          backgroundColor: type === "success" ? "#4E8D7C" :  "#F64B3C",
          borderRadius: 5,
          p: 1.5
        }}
        
      >
        <Box
          sx={{
            position: "relative",
            bottom: 31,
            left: 5
          }}
        >
          <ErrorIconSnack filled color={type === "success" ?  "#396559" : "#C81912" } type={type}/>
        </Box>


        <Box
          sx={{
            position: "relative",
            bottom: 24.2,
            left: -12
          }}
        >
          <DownImageSnack filled color={type === "success" ? "#396559" : "#C81912"} />
        </Box>

        <IconButton
          sx={{
            position: "absolute",
            top: "18px",
            right: 22,
            zIndex :  1
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen();
          }}>

          <CloseIcon sx={
            {
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer"
            }
          }

          />
        </IconButton>


        <Box
          sx={{
            position: "absolute",
            top: "17px",
            left: 60
          }}
        >
          <Typography
            fontFamily={"Inter"}
            fontSize={"20px"}
            color={"#FFFFFF"}
          >
            {title}
          </Typography>

          <Typography
            fontFamily={"Inter"}
            fontSize={"13px"}
            color={"#FFFFFF"}
          >
            {message}
          </Typography>

        </Box>
      </Box>
    </Snackbar>
  );
}
