"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import SummaryClients from "./moduleComponents/SummaryClients";
import TableClientsList from "./moduleComponents/TableClientsList";
import CustomModal from "../../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import CreateClientForm from "./moduleComponents/forms/createClientForm";
import { IClient, IPaginateClients, IPaginationResult } from "../../../../../api/src/interfaces";
import { userService } from "./userService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminClientes() {
    const [open, setOpen] = React.useState(false);
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null)
    const [filters, setFilers] = useState<IPaginateClients>({
        page: 1,
        limit: 10,
    })
    const [result, setResult] = useState<IPaginationResult>()

    const getAllClients = useCallback(async () => {
        const result = await userService.getAllClients(filters)
        setResult(result)
    }, [setResult, filters])

    useEffect(() => {
        getAllClients()
    }, [filters, getAllClients])

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
                <TableClientsList
                    onDoubleClickRow={(client: IClient) => {
                        setSelectedClient(client)
                        setOpen(true)
                    }}
                    setFilers={setFilers}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                />
            </Box>

            <CustomModal open={open} borderRadius={"12px"}>
                <Box padding={"28px 24px"} maxWidth={423} minWidth={350} maxHeight={"70vh"}
                    sx={{
                        ...style.hideScroll
                    }}
                >

                    <Grid container p={0} m={0} justifyContent={"space-between"} >
                        <Typography fontFamily={"Poppins"} fontSize={"20px"} fontWeight={600}>Agregar Nuevo Cliente</Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                            onClick={() => {
                                setOpen(false);
                                setFilers({ limit: 10, page: 1 })
                                setSelectedClient(null)
                            }}
                        />

                    </Grid>

                    <CreateClientForm
                        valuesToEdit={selectedClient?._id ? selectedClient : {}}
                        onClose={() => {
                            setOpen(false);
                            setFilers({ limit: 10, page: 1 })
                            setSelectedClient(null)
                        }
                        }
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
        color: "#45464E",
    }
}