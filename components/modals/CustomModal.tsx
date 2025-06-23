"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function CustomModal({ open, children, borderRadius = 12 } : { open: boolean, children: React.ReactNode, borderRadius?: number |
     string
}) {
    return (

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
        >
           
                <Box sx={{ ...styles, borderRadius: borderRadius }} >
                    {children}
                </Box>
        </Modal>
    );
}

const styles = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    outline: "none",
    boxShadow: 24,
    overflow: "auto"
};