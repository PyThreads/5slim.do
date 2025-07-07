"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Grid, Popover, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import TableOrderDetailList from "../moduleComponents/TableOrderDetailList";
import { IOrder } from "../../../../../../api/src/interfaces";
import { ordersService } from "../ordersService";
import { useRouter, useParams } from "next/navigation";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SplashScreen from "../../../../providers/SplashScreen";
import SummaryOrderDetails from "../moduleComponents/SummaryOrderDetails";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function AdminClientes() {
    const router = useRouter()
    const [order, setOrder] = useState<IOrder | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    if (!params._id) {
        router.push(`/admin/dashboard/inventory/newArticle/${params._id}`)
    }

    const getOrder = useCallback(async () => {
        const result = await ordersService.getOrderDetails({ _id: params._id, page: 1, limit: 1 });
        setOrder(result)
        setLoading(false);
    }, [setOrder, setLoading,params])

    useEffect(() => {
        getOrder()
    }, [getOrder])

    const handlePrint = async() => {
        await ordersService.printOrder(order!._id);
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            {

                (loading && !order) ?
                    (
                        <SplashScreen />
                    )
                    :
                    (
                        <Grid>
                            <Grid container justifyContent={"space-between"} alignItems={"center"}>

                                <Box sx={{ display: "flex" }}>
                                    <Box sx={{ display: "flex" }}>
                                        <Typography fontFamily={"Inter"} fontSize={16} color={"#45464E"}>Orden Número  </Typography>
                                        <Typography fontFamily={"Inter"} fontSize={16} color={"#45464E40"} ml={0.5}> #{order?._id}</Typography>
                                    </Box>

                                    <Box sx={{ display: "flex" }} ml={3}>
                                        <Typography fontFamily={"Inter"} fontSize={16} color={"#45464E"}>Fecha</Typography>
                                        <Typography fontFamily={"Inter"} fontSize={16} color={"#45464E40"} ml={0.5}>{ordersService.formatAmPmLetters(order!.createdDate)}</Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Button variant="contained" sx={{ ...style.accionButton }}
                                        endIcon={<KeyboardArrowDownIcon />}
                                        onClick={(event) => setAnchorEl(event.currentTarget)}
                                    >
                                        Acción
                                    </Button>

                                    <Button variant="contained" sx={{ ...style.accionButton, ...style.cancelButton, ml: 2 }}
                                    >
                                        Cancelar Orden
                                    </Button>
                                </Box>

                            </Grid>

                            <Box mt={"23px"}>
                                <SummaryOrderDetails order={order!} />
                            </Box>

                            <Box mt={"23px"} pb={10}>
                                <TableOrderDetailList order={order!} />
                            </Box>


                            <Popover
                                id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                disableScrollLock
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                disableAutoFocus
                                disableEnforceFocus
                                PaperProps={{
                                    sx: {
                                        width: anchorEl && (anchorEl?.clientWidth || 0),
                                        display: anchorEl ? "block" : "none",
                                    }
                                }}
                            >
                                <Box p={1}>
                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer" }} mb={1}
                                        onClick={handlePrint}
                                    >
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                            Imprimir
                                        </Typography>
                                        <LocalPrintshopIcon fontSize="small" />
                                    </Box>
                                </Box>
                            </Popover>

                        </Grid >
                    )
            }
        </React.Fragment>
    )
}

const style = {
    accionButton: {
        backgroundColor: "#1C1D22",
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#1C1D22",
        }
    },
    cancelButton: {
        backgroundColor: "#CC5F5F",
        "&:hover": { backgroundColor: "#CC5F5F" }
    },
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: 16,
        color: "#45464E",
    }
}