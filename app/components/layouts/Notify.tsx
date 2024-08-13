"use client"
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../context/axiosInstance';
import { TextField } from '@mui/material';
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 380,
    minWidth:300,
    bgcolor: 'background.paper',
    borderRadius: 4,
    outline: "none",
    boxShadow: 24,
    p: 4,
};

export default function NotifySubscribed() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)

        try {

            await axiosInstance.post("users/public/suscribeLaunch", formData);
            handleOpen();

        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Box sx={{ position: "relative", height: { xs: 35, sm: 60 }, marginTop: "10px", }}>

                    <TextField placeholder="Ingresa tu Email"
                        name='email'
                        sx={{ height: "100%" }}
                        fullWidth
                        InputProps={
                            {
                                style: {
                                    fontSize: "13px",
                                    paddingLeft: 10,
                                    borderRadius: 60,
                                    border: "solid 1px #BEBEBE",
                                    outline: "none",
                                    height: "100%"
                                }
                            }
                        }
                    />


                    <Button
                        type="submit"
                        sx={{
                            position: "absolute",
                            right: 0,
                            height: "100%",
                            backgroundColor: "#001987",
                            borderRadius: 60,
                            textTransform: "inherit",
                            color: "white",
                            fontWeight: "500",
                            ":hover": {
                                backgroundColor: "#001987"
                            },
                            width: { xs: 130, sm: 135, md: 140, lg: 200 }
                        }}
                        startIcon={
                            <Image
                                alt={"5slim.do. logo"}
                                style={{ objectFit: "contain" }}
                                width={25}
                                height={25}
                                src={"/flash-lines.png"}
                            />
                        }
                    >
                        Notificarme
                    </Button>

                </Box>
            </form>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style} textAlign={"center"}>

                        <CloseIcon
                            sx={{
                                position: "absolute",
                                right: 10,
                                top: 10,
                                cursor: "pointer"
                            }}

                            onClick={() => setOpen(false)}
                        />

                        <Image
                            alt={"5slim.do. logo"}
                            style={{ objectFit: "contain" }}
                            width={40}
                            height={35}
                            src={"/flash-lines.png"}
                        />

                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Gracias por suscribirte al lanzamiento de nuestra tienda en linea.
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}