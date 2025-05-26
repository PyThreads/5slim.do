"use client"
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Poppins } from 'next/font/google';
import CreateArticleForm from '../forms/createArticlesForm';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "600"
})


export default function CreateArticlesModal({ open, setOpen, callBack,valuesToEdit = {} }: { open: boolean, setOpen: Function, callBack: Function,valuesToEdit:any }) {

    const handleClose = () => setOpen(false);

    return (

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 1000,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={styles} >

                    <CloseIcon
                        sx={{
                            position: "absolute",
                            right: 20,
                            top: 20,
                            cursor: "pointer"
                        }}
                        onClick={() => setOpen(false)}
                    />

                    <Typography sx={{ ...style.title }}>Agregar nuevo articulo</Typography>
                    
                    <CreateArticleForm onClose={handleClose} valuesToEdit={valuesToEdit}/>

                </Box>
            </Fade>
        </Modal>
    );
}

const style = {
    title: {
        fontFamily: poppins.style.fontFamily,
        fontSize: 32,
        color: "#001B66",
    }
}

const styles = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: {xs: "95%", md: "90%"},
    bgcolor: 'background.paper',
    borderRadius: 4,
    outline: "none",
    boxShadow: 24,
    p:  {xs: "25px", md: "60px"},
    overflow: "auto"
};