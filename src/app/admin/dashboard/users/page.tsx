"use client"
import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import SummaryClients from "./moduleComponents/SummaryClients";
import TableClientsList from "./moduleComponents/TableClientsList";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminClientes() {

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                <Typography sx={{ ...style.title }}>Resumen Clientes</Typography>

                <Button variant="contained" sx={{ ...style.addButton }}
                    startIcon={<AddIcon />}
                >
                    Agregar Nuevo Cliente
                </Button>

            </Grid>

            <Box mt={"23px"}>
                <SummaryClients />
            </Box>

            <Box mt={"23px"}  pb={10}> 
                <TableClientsList />
            </Box>


        </Box>
    )
}

const style = {
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