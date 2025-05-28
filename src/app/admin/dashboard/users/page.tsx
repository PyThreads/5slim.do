"use client"
import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import SummaryClients from "./moduleComponents/SummaryClients";
import TableClientsList from "./moduleComponents/TableClientsList";
import CustomModal from "../../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import CreateClientForm from "./moduleComponents/forms/createClientForm";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminClientes() {
    const [open, setOpen] = React.useState(false);

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Resumen Clientes</Typography>

                <Button variant="contained" sx={{ ...style.addButton }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Agregar Nuevo Cliente
                </Button>

            </Grid>

            <Box mt={"23px"}>
                <SummaryClients />
            </Box>

            <Box mt={"23px"} pb={10}>
                <TableClientsList />
            </Box>


            <CustomModal open={open} borderRadius={"12px"}>
                <Box padding={"28px 24px"} width={423} maxHeight={"90vh"}
                    sx={{
                        ...style.hideScroll
                    }}
                >

                    <Grid container p={0} m={0} justifyContent={"space-between"} >
                        <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Agregar Nuevo Cliente</Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px" }}
                            onClick={() => setOpen(false)}
                        />

                    </Grid>

                    <CreateClientForm
                        valuesToEdit={{}}
                        onClose={() => setOpen(false)}
                    />
                </Box>
            </CustomModal>

        </Box>
    )
}

const style = {
    hideScroll: {
        overflowY: "scroll",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
        },
    },
    addButton: {
        backgroundColor: "#5570F1",
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    },
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: 16,
        color: "#45464E",
    }
}