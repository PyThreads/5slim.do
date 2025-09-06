"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import TableUsersList from "./moduleComponents/TableUsersList";
import CustomModal from "../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import CreateUserForm from "./moduleComponents/CreateUserForm";
import { userManagementService } from "./userManagementService";
import { useAdminAuth } from "../../../../context/AdminContext";
import { eventBus } from "../../../utils/broadcaster";
import SimpleSnackbar from "../../../../components/notifications/SimpleSnackbar";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function GestionUsuarios() {
    const { currentAdmin } = useAdminAuth() as { currentAdmin: any };
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    })
    const [result, setResult] = useState<any>()
    const [notification, setNotification] = useState<any>(null)

    // Verificar si el usuario tiene rol de Support
    const hasSuportRole = currentAdmin?.role?.some((item: string) => item === "Support");

    const getAllUsers = useCallback(async () => {
        if (!hasSuportRole) return;
        
        try {
            const result = await userManagementService.getAllUsers(filters)
            setResult(result)
        } catch (error) {
            // Error is handled by the service with EventBus
        }
    }, [setResult, filters, hasSuportRole])

    useEffect(() => {
        getAllUsers()
    }, [filters, getAllUsers])

    useEffect(() => {
        const handleNotification = (data: any) => {
            setNotification({ ...data, open: true });
        };
        
        eventBus.on('notification', handleNotification);
        
        return () => {
            eventBus.off('notification', handleNotification);
        };
    }, [])

    // Si no tiene rol de support, no mostrar el módulo
    if (!hasSuportRole) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" sx={{ fontFamily: inter.style.fontFamily, color: '#666' }}>
                    No tienes permisos para acceder a este módulo
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                <Typography sx={{ ...style.title }}>Gestión de Usuarios</Typography>

                <Button 
                    variant="contained" 
                    sx={style.addButton}
                    onClick={() => setOpen(true)}
                >
                    <AddIcon />
                    <Box sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}>
                        Agregar Usuario
                    </Box>
                </Button>
            </Grid>

            <Box mt={"23px"} pb={10}>
                <TableUsersList
                    onDoubleClickRow={(user: any) => {
                        setSelectedUser(user)
                        setOpen(true)
                    }}
                    setFilters={setFilters}
                    rows={result?.list || []}
                    currentPage={filters.page}
                    limit={filters.limit}
                    totalItems={result?.totalItems || 0}
                    totalPages={result?.totalPages || 0}
                />
            </Box>

            <CustomModal open={open} borderRadius={"12px"}>
                <Box padding={"28px 24px"} maxWidth={423} minWidth={350} maxHeight={"70vh"}
                    sx={{ ...style.hideScroll }}
                >
                    <Grid container p={0} m={0} justifyContent={"space-between"} >
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"20px"} fontWeight={400}>
                            {selectedUser?._id ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                        </Typography>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                            onClick={() => {
                                setOpen(false);
                                setFilters({ limit: 10, page: 1 })
                                setSelectedUser(null)
                            }}
                        />
                    </Grid>

                    <CreateUserForm
                        valuesToEdit={selectedUser?._id ? selectedUser : {}}
                        onClose={() => {
                            setOpen(false);
                            setFilters({ limit: 10, page: 1 })
                            setSelectedUser(null)
                        }}
                    />
                </Box>
            </CustomModal>
            
            {notification && (
                <SimpleSnackbar
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    open={notification.open}
                    setOpen={() => setNotification(null)}
                />
            )}
        </Box>
    )
}

const style = {
    hideScroll: {
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    addButton: {
        backgroundColor: "#5570F1",
        fontSize: { xs: 12, sm: 14, md: 16 },
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