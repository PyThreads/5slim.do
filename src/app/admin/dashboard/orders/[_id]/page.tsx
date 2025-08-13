"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Checkbox, Grid, Popover, Typography } from "@mui/material"
import { Inter } from "next/font/google"
import TableOrderDetailList from "../moduleComponents/TableOrderDetailList";
import { CancelOrderType, IOrder, IOrderStatus } from "../../../../../../api/src/interfaces";
import { ordersService } from "../ordersService";
import { useRouter, useParams } from "next/navigation";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SplashScreen from "../../../../providers/SplashScreen";
import SummaryOrderDetails from "../moduleComponents/SummaryOrderDetails";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CircularProgress from '@mui/material/CircularProgress';
import CustomModal from "../../../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckIcon from '@mui/icons-material/Check';
import { eventBus } from "../../../../utils/broadcaster";

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
    const [action, setaction] = useState("")
    const [modalCancel, setModalCancel] = useState(false);
    const [cancelType, setCancelType] = useState<CancelOrderType>(CancelOrderType.RETURN_ITEMS)
    const [canceled, setCanceled] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const params = useParams();

    if (!params._id) {
        router.push(`/admin/dashboard/inventory/newArticle/${params._id}`)
    }

    const getOrder = useCallback(async () => {
        const result = await ordersService.getOrderDetails({ _id: params._id, page: 1, limit: 1 });
        setOrder(result)
        setLoading(false);
    }, [setOrder, setLoading, params])

    useEffect(() => {
        getOrder()
    }, [getOrder])

    const handlePrint = async () => {
        setaction("Imprimiendo")
        setAnchorEl(null);
        await ordersService.printOrder(order!._id);
        setaction("")
    };

    const handleStatus = async (status: IOrderStatus) => {
        try {

            if(order!.status === IOrderStatus.DELIVERED){
                eventBus.emit("notify", { message: "Si la orden se encuentra entregada no se puede modificar el estado, debe cancelar.", open: true, type: "error", title: "Guardado!" })
                return;
            }
            setaction("Cambiando estado")
            setAnchorEl(null);
            const orderUpdated = await ordersService.updateOrderStatus({ orderId: order!._id, status });
            setOrder(orderUpdated);

        } finally {
            setaction("")
        }
    }

    const handleCloseCancel = () => {
        setLoadingCancel(true)
        setCancelType(CancelOrderType.RETURN_ITEMS)
        setModalCancel(false);
        setCanceled(false)
        setLoadingCancel(false);
    }

    const cancelOrder = async () => {
        try {
            if (order?.status === IOrderStatus.CANCELLED) {
                return
            }
            setLoadingCancel(true);
            const orderUpdated = await ordersService.cancelOrder({ orderId: order!._id, type: cancelType });
            setOrder(orderUpdated);
            setCanceled(true);

        } finally {
            setLoadingCancel(false);
        }
    }

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
                            <Grid container justifyContent={"space-between"} alignItems={{ xs: "flex-start", sm: "center" }} spacing={{ xs: 2, sm: 0 }}>

                                <Grid item xs={12} sm="auto">
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 3 } }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography fontFamily={"Inter"} color={"#45464E"}
                                                sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500 }}
                                            >
                                                Orden Número
                                            </Typography>
                                            <Typography fontFamily={"Inter"} color={"#45464E40"} ml={0.5}
                                                sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600 }}
                                            > #{order?._id}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500 }}>Fecha</Typography>
                                            <Typography fontFamily={"Inter"} color={"#45464E40"} ml={0.5} sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 400 }}>{ordersService.formatAmPmLetters(order!.createdDate)}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm="auto">

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                                    <Button variant="contained" sx={{ ...style.accionButton }}
                                        endIcon={action ? <CircularProgress sx={{ color: "white" }} size={13} /> : <KeyboardArrowDownIcon />}
                                        onClick={(event) => {
                                            if(order!.status === IOrderStatus.CANCELLED){
                                                return;
                                            }
                                            setAnchorEl(event.currentTarget)
                                        }}
                                    >
                                        {action ? action : "Acción"}
                                    </Button>

                                    <Button variant="contained" sx={{ ...style.accionButton, ...style.cancelButton }}
                                        onClick={() => {
                                            if (order?.status === IOrderStatus.CANCELLED) {
                                                return
                                            }
                                            setModalCancel(true)
                                        }}
                                    >
                                        Cancelar Orden
                                    </Button>
                                    </Box>
                                </Grid>

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
                                        display: anchorEl ? "block" : "none",
                                    }
                                }}
                            >
                                <Box p={1}>
                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                    
                                        onClick={handlePrint}
                                    >
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                            Imprimir
                                        </Typography>
                                        <LocalPrintshopIcon fontSize="small" />
                                    </Box>

                                    {

                                        Object.entries(IOrderStatus).filter(item => item[1] !== IOrderStatus.CANCELLED).map(([_, value]) =>
                                        (
                                            <Box key={value} display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                onClick={() => handleStatus(value)}
                                            >
                                                <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                    {value}
                                                </Typography>
                                                <ReceiptIcon fontSize="small" />
                                            </Box>
                                        ))
                                    }

                                </Box>
                            </Popover>

                        </Grid >
                    )
            }

            <CustomModal
                open={modalCancel}
                borderRadius={"16px"}
            >
                <Grid container width={320} p={1}>

                    <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>

                        <CloseIcon sx={{ backgroundColor: "#FFF2E2", width: 32, height: 32, borderRadius: "8px", cursor: "pointer", padding: "5px", color: "#000" }}
                            onClick={handleCloseCancel}
                        />
                    </Grid>

                    {
                        !canceled ?

                            <React.Fragment>
                                <Grid item xs={12}>
                                    <Typography fontFamily={"Inter"} fontWeight={400} fontSize={"18px"} mt={2} ml={1.3}>
                                        Seleccione una opción:
                                    </Typography>
                                </Grid>

                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={12} mt={-1} textAlign={"center"}>
                                        <Checkbox
                                            value={CancelOrderType.CANCEL_ONLY}
                                            checked={cancelType === CancelOrderType.CANCEL_ONLY}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            onChange={(e: any) => setCancelType(e.target.value)}
                                        />
                                        No agregar items al inventario.
                                    </Grid>

                                    <Grid item xs={12} mt={-1} textAlign={"center"}>
                                        <Checkbox
                                            value={CancelOrderType.RETURN_ITEMS}
                                            checked={cancelType === CancelOrderType.RETURN_ITEMS}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            onChange={(e: any) => setCancelType(e.target.value)}
                                        />
                                        Agregar items al inventario.
                                    </Grid>


                                    <Button variant="contained" sx={{ ...style.accionButton, ml: 2, mt: 2, height: 36 }}
                                        fullWidth
                                        onClick={cancelOrder}
                                        endIcon={loadingCancel ? <CircularProgress sx={{ color: "white" }} size={13} /> : null}
                                    >
                                        {loadingCancel ? "Cancelando" : "Cancelar Orden"}
                                    </Button>
                                </Grid>
                            </React.Fragment>

                            :

                            <React.Fragment>
                                {
                                    !loadingCancel ?

                                        <Grid container spacing={2} mt={1} mb={2} justifyContent={"center"} sx={{ transition: "2s" }}>
                                            <Grid item xs={12} textAlign={"center"}>
                                                <CheckIcon sx={{ fontSize: 100, p: 2, backgroundColor: "#CC5F5F", color: "white", borderRadius: "100%", transition: "2" }} />
                                                <Typography fontFamily={"Inter"} fontWeight={400} fontSize={"18px"} mt={2}>Orden cancelada</Typography>
                                            </Grid>
                                        </Grid>

                                        :

                                        <Grid container spacing={2} mt={1} mb={2} justifyContent={"center"}>
                                            <Grid item xs={12} textAlign={"center"}>
                                                <Typography fontFamily={"Inter"} fontWeight={400} fontSize={"18px"} mt={2}>Cancelando orden...</Typography>
                                            </Grid>
                                        </Grid>
                                }
                            </React.Fragment>
                    }

                </Grid>
            </CustomModal>
        </React.Fragment>
    )
}

const style = {
    accionButton: {
        backgroundColor: "#1C1D22",
        fontSize: { xs: 14, sm: 14 },
        fontFamily: inter.style.fontFamily,
        height: { xs: 44, sm: 36 },
        minWidth: { xs: '100%', sm: 'auto' },
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