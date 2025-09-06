"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Inter } from "next/font/google";
import AddIcon from '@mui/icons-material/Add';
import CustomModal from "../../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import { useAdminAuth } from "../../../../../context/AdminContext";
import { eventBus } from "../../../../utils/broadcaster";
import SimpleSnackbar from "../../../../../components/notifications/SimpleSnackbar";
import CarouselForm from "./CarouselForm";
import CarouselTable from "./CarouselTable";
import { carouselStoreService } from "../carouselStoreService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

export default function CarouselTiendaTab() {
    const { currentAdmin } = useAdminAuth() as { currentAdmin: any };
    const [open, setOpen] = useState(false);
    const [selectedCarousel, setSelectedCarousel] = useState<any | null>(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    });
    const [result, setResult] = useState<any>();
    const [notification, setNotification] = useState<any>(null);

    const getAllCarousels = useCallback(async () => {
        try {
            const result = await carouselStoreService.getAllCarousels(filters);
            setResult(result);
        } catch (error) {
            // Error handled by service
        }
    }, [filters]);

    useEffect(() => {
        getAllCarousels();
    }, [filters, getAllCarousels]);

    useEffect(() => {
        const handleNotification = (data: any) => {
            setNotification({ ...data, open: true });
        };
        
        eventBus.on('notification', handleNotification);
        
        return () => {
            eventBus.off('notification', handleNotification);
        };
    }, []);

    return (
        <Box>
            <Grid container justifyContent={"space-between"} alignItems={"center"} mb={3}>
                <Typography sx={style.subtitle}>Carousel de la Tienda</Typography>

                <Button 
                    variant="contained" 
                    sx={style.addButton}
                    onClick={() => setOpen(true)}
                >
                    <AddIcon />
                    <Box sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}>
                        Agregar Slide
                    </Box>
                </Button>
            </Grid>

            <CarouselTable
                onDoubleClickRow={(carousel: any) => {
                    setSelectedCarousel(carousel);
                    setOpen(true);
                }}
                setFilters={setFilters}
                rows={result?.list || []}
                currentPage={filters.page}
                limit={filters.limit}
                totalItems={result?.totalItems || 0}
                totalPages={result?.totalPages || 0}
            />

            <CustomModal open={open} borderRadius={"12px"}>
                <Box padding={"28px 24px"} maxWidth={600} minWidth={500} maxHeight={"80vh"}
                    sx={style.hideScroll}
                >
                    <Grid container p={0} m={0} justifyContent={"space-between"}>
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"20px"} fontWeight={400}>
                            {selectedCarousel?._id ? "Editar Slide" : "Agregar Nuevo Slide"}
                        </Typography>

                        <CloseIcon 
                            sx={style.closeIcon}
                            onClick={() => {
                                setOpen(false);
                                setSelectedCarousel(null);
                            }}
                        />
                    </Grid>

                    <CarouselForm
                        valuesToEdit={selectedCarousel?._id ? selectedCarousel : {}}
                        onClose={() => {
                            setOpen(false);
                            setSelectedCarousel(null);
                            getAllCarousels();
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
    );
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
    subtitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "18px",
        fontWeight: 600,
        color: "#45464E",
    },
    closeIcon: {
        backgroundColor: "#FFF2E2",
        width: 32,
        height: 32,
        borderRadius: "8px",
        cursor: "pointer",
        padding: "5px",
        color: "#000"
    }
};