"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Tabs, Tab } from "@mui/material"
import { Inter } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import TableUsersList from "./moduleComponents/TableUsersList";
import CustomModal from "../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import CreateUserForm from "./moduleComponents/CreateUserForm";
import { userManagementService } from "./userManagementService";
import { useAdminAuth } from "../../../../context/AdminContext";
import { eventBus, notify } from "../../../utils/EventBus";
import SimpleSnackbar from "../../../../components/notifications/SimpleSnackbar";
import CarouselTiendaTab from "./moduleComponents/CarouselTiendaTab";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TiendaOnline() {
    const { currentAdmin } = useAdminAuth() as { currentAdmin: any };
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    })
    const [result, setResult] = useState<any>()
    const [notification, setNotification] = useState<any>(null)
    const [tabValue, setTabValue] = useState(0)

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
                <Typography sx={{ ...style.title }}>Tienda Online</Typography>
            </Grid>

            <Box mt={"23px"}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={style.tabs}>
                    <Tab label="Carousel Tienda" sx={style.tab} />
                </Tabs>

                <Box mt={2}>
                    {tabValue === 0 && <CarouselTiendaTab />}
                </Box>
            </Box>
            
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
    tabs: {
        borderBottom: "1px solid #E1E2E9",
        "& .MuiTabs-indicator": {
            backgroundColor: "#5570F1",
        },
    },
    tab: {
        fontFamily: inter.style.fontFamily,
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 500,
        color: "#8B8D97",
        "&.Mui-selected": {
            color: "#5570F1",
        },
    },
    title: {
        fontFamily: inter.style.fontFamily,
        color: "#45464E",
    }
}