"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Checkbox, Grid, Popover, Typography, Dialog } from "@mui/material"
import { Inter } from "next/font/google"
import TableOrderDetailList from "../moduleComponents/TableOrderDetailList";
import { CancelOrderType, IOrder, IOrderStatus } from "../../../../../api/src/interfaces";
import { ordersService } from "../ordersService";
import { useRouter, useParams } from "next/navigation";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SplashScreen from "../../../../providers/SplashScreen";
import SummaryOrderDetails from "../moduleComponents/SummaryOrderDetails";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LabelIcon from '@mui/icons-material/Label';
import CircularProgress from '@mui/material/CircularProgress';
import CustomModal from "../../../../../components/modals/CustomModal";
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckIcon from '@mui/icons-material/Check';

import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { eventBus } from "../../../../utils/broadcaster";
import CustomField from "../../../../../components/inputs/CustomField";
import { baseService } from "../../../../utils/baseService";
import {  Paper } from "@mui/material";

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

    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: '',
        method: 'Efectivo',
        paymentDate: baseService.dateToDateTimeLocal(baseService.newDate()),
        reference: '',
        notes: ''
    });
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

    const handlePrint = async (label=false) => {
        setaction("Imprimiendo")
        setAnchorEl(null);
        label ? await ordersService.printOrderLabel(order!._id) : await ordersService.printOrder(order!._id);
        setaction("")
    };

    const handlePrint4x3 = async () => {
        setaction("Imprimiendo")
        setAnchorEl(null);
        await ordersService.printOrder4x3(order!._id);
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



    const handleOpenPaymentModal = () => {
        setPaymentModal(true);
        setAnchorEl(null);
    };

    const handleSavePayment = async () => {
        try {
            const currentAmount = parseFloat(paymentData.amount);
            const totalPaid = order?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
            const orderTotal = order?.total?.total || 0;
            
            if (totalPaid + currentAmount > orderTotal) {
                eventBus.emit("notify", { 
                    message: `El monto excede el total de la orden. Máximo permitido: ${baseService.dominicanNumberFormat(orderTotal - totalPaid)}`, 
                    open: true, 
                    type: "error", 
                    title: "Error!" 
                });
                return;
            }

            const payment = {
                ...paymentData,
                amount: currentAmount,
                paymentDate: new Date(paymentData.paymentDate)
            };
            const updatedOrder = await ordersService.addPayment({ orderId: order!._id, payment });
            setOrder(updatedOrder);
            setPaymentModal(false);
            setPaymentData({
                amount: '',
                method: 'Efectivo',
                paymentDate: baseService.dateToDateTimeLocal(new Date()),
                reference: '',
                notes: ''
            });
        } catch (error) {
            // Error is handled in the service
        }
    };

    const getStatusIcon = (status: IOrderStatus) => {
        switch (status) {
            case IOrderStatus.PENDING:
                return <PendingIcon fontSize="small" />;

            case IOrderStatus.PREPARING_FOR_DELIVERY:
                return <LocalShippingOutlinedIcon fontSize="small" />;
            case IOrderStatus.SENT:
                return <LocalShippingIcon fontSize="small" />;
            case IOrderStatus.DELIVERED:
                return <CheckCircleIcon fontSize="small" />;
            default:
                return <ReceiptIcon fontSize="small" />;
        }
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
                            <Grid container justifyContent={"space-between"} alignItems={{ xs: "flex-start", sm: "center" }} spacing={{ xs: 2, sm: 0 }}>

                                <Grid item xs={12} sm="auto">
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 3 } }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"}
                                                sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 500 }}
                                            >
                                                Orden Número
                                            </Typography>
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E40"} ml={0.5}
                                                sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 400 }}
                                            > #{order?._id}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 500 }}>Fecha</Typography>
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E40"} ml={0.5} sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 400 }}>{ordersService.formatAmPmLetters(order!.createdDate)}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 500 }}>Estado de Pago</Typography>
                                            <Typography 
                                                fontFamily={inter.style.fontFamily} 
                                                ml={0.5} 
                                                sx={{ 
                                                    fontSize: { xs: "12px", sm: "14px" }, 
                                                    fontWeight: 400,
                                                    color: order?.paymentStatus === 'Pagado' ? '#28a745' : 
                                                           order?.paymentStatus === 'Pagado Parcialmente' ? '#ffc107' : '#dc3545'
                                                }}
                                            >
                                                {order?.paymentStatus || 'No Pagado'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm="auto">

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
                                    <Button variant="contained" sx={{ ...style.accionButton }}
                                        endIcon={action ? <CircularProgress sx={{ color: "white" }} size={13} /> : <KeyboardArrowDownIcon />}
                                        onClick={(event) => {
                                            setAnchorEl(event.currentTarget)
                                        }}
                                    >
                                        {action ? action : "Acción"}
                                    </Button>

                                    {((order?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) < (order?.total?.total || 0)) && (
                                        <Button 
                                            variant="contained" 
                                            onClick={handleOpenPaymentModal}
                                            sx={{ 
                                                ...style.accionButton, 
                                                backgroundColor: "#28a745", 
                                                "&:hover": { backgroundColor: "#218838" },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '44px',
                                                width: 'auto'
                                            }}
                                        >
                                            <AttachMoneyIcon />
                                        </Button>
                                    )}

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
                                <SummaryOrderDetails order={order!} onOrderUpdate={setOrder} />
                            </Box>

                            {order?.payments && order.payments.length > 0 && (
                                <Box mt={"23px"}>
                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={400} color={"#45464E"} mb={2}>
                                        Historial de Pagos
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {order.payments.map((payment, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, border: '1px solid #e0e0e0' }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={400} color={"#28a745"}>
                                                            {baseService.dominicanNumberFormat(payment.amount)}
                                                        </Typography>
                                                        <Box sx={{ 
                                                            backgroundColor: payment.method === 'Efectivo' ? '#28a745' : 
                                                                           payment.method === 'Tarjeta' ? '#007bff' : '#ffc107',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: '12px'
                                                        }}>
                                                            {payment.method}
                                                        </Box>
                                                    </Box>
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"12px"} color={"#6c757d"} mb={0.5}>
                                                        {ordersService.formatAmPmLetters(payment.paymentDate)}
                                                    </Typography>
                                                    {payment.reference && (
                                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"12px"} color={"#6c757d"} mb={0.5}>
                                                            Ref: {payment.reference}
                                                        </Typography>
                                                    )}
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"11px"} color={"#6c757d"}>
                                                        Por: {payment.createdBy.fullName}
                                                    </Typography>
                                                    {payment.notes && (
                                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"11px"} color={"#6c757d"} mt={0.5} fontStyle="italic">
                                                            {payment.notes}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        ))}
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={400}>
                                                        Total Pagado
                                                    </Typography>
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"16px"} fontWeight={400} color={"#28a745"}>
                                                        {baseService.dominicanNumberFormat(order.payments.reduce((sum, p) => sum + p.amount, 0))}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

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
                                        minWidth: "220px"
                                    }
                                }}
                            >
                                <Box p={1}>
                                    <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 1 }}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={400} color={"#45464E"}>
                                            Total envío: {baseService.dominicanNumberFormat(order?.shipment || 0)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                    
                                        onClick={()=>handlePrint()}
                                    >
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                            Imprimir factura
                                        </Typography>
                                        <LocalPrintshopIcon fontSize="small" />
                                    </Box>

                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                    
                                        onClick={()=>handlePrint(true)}
                                    >
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                            Imprimir label
                                        </Typography>
                                        <LabelIcon fontSize="small" />
                                    </Box>

                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                        onClick={()=>handlePrint4x3()}
                                    >
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                            Imprimir 4x3
                                        </Typography>
                                        <LocalPrintshopIcon fontSize="small" />
                                    </Box>



                                    {order!.status !== IOrderStatus.CANCELLED && (
                                        <>

                                            {[IOrderStatus.PENDING, IOrderStatus.PREPARING_FOR_DELIVERY].includes(order!.status) && (
                                                <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                    onClick={() => handleStatus(IOrderStatus.SENT)}
                                                >
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                        Marcar como enviado
                                                    </Typography>
                                                    <LocalShippingOutlinedIcon fontSize="small" />
                                                </Box>
                                            )}

                                            {
                                                Object.entries(IOrderStatus).filter(item => item[1] !== IOrderStatus.CANCELLED && item[1] !== IOrderStatus.SENT).map(([_, value]) =>
                                                (
                                                    <Box key={value} display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                        onClick={() => handleStatus(value)}
                                                    >
                                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                            {value}
                                                        </Typography>
                                                        {getStatusIcon(value)}
                                                    </Box>
                                                ))
                                            }
                                        </>
                                    )}

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
                                    <Typography fontFamily={inter.style.fontFamily} fontWeight={400} fontSize={"18px"} mt={2} ml={1.3}>
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
                                                <Typography fontFamily={inter.style.fontFamily} fontWeight={400} fontSize={"18px"} mt={2}>Orden cancelada</Typography>
                                            </Grid>
                                        </Grid>

                                        :

                                        <Grid container spacing={2} mt={1} mb={2} justifyContent={"center"}>
                                            <Grid item xs={12} textAlign={"center"}>
                                                <Typography fontFamily={inter.style.fontFamily} fontWeight={400} fontSize={"18px"} mt={2}>Cancelando orden...</Typography>
                                            </Grid>
                                        </Grid>
                                }
                            </React.Fragment>
                    }

                </Grid>
            </CustomModal>



            <Dialog 
                open={paymentModal} 
                onClose={() => setPaymentModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        p: 0
                    }
                }}
            >
                <Box sx={{ position: 'relative', p: 3 }}>
                    <CloseIcon 
                        sx={{ 
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            cursor: 'pointer',
                            color: '#6E7079',
                            '&:hover': {
                                color: '#45464E'
                            }
                        }}
                        onClick={() => setPaymentModal(false)}
                    />
                    <Typography sx={{ 
                        fontFamily: inter.style.fontFamily, 
                        fontSize: '18px', 
                        fontWeight: 400, 
                        color: '#45464E',
                        mb: 1,
                        pr: 4
                    }}>
                        Agregar Pago
                    </Typography>
                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', color: '#6c757d' }}>
                            Total de la orden: <strong>{baseService.dominicanNumberFormat(order?.total?.total || 0)}</strong>
                        </Typography>
                        <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', color: '#6c757d' }}>
                            Total pagado: <strong>{baseService.dominicanNumberFormat(order?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)}</strong>
                        </Typography>
                        <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', color: '#28a745', fontWeight: 400 }}>
                            Restante: <strong>{baseService.dominicanNumberFormat((order?.total?.total || 0) - (order?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0))}</strong>
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <CustomField
                                fullWidth
                                type="number"
                                label="Monto"
                                placeholder="0.00"
                                value={paymentData.amount}
                                onChange={(e: any) => setPaymentData({...paymentData, amount: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CustomField
                                fullWidth
                                select
                                label="Método de Pago"
                                value={paymentData.method}
                                onChange={(e: any) => setPaymentData({...paymentData, method: e.target.value})}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </CustomField>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomField
                                fullWidth
                                type="datetime-local"
                                label="Fecha de Pago"
                                value={paymentData.paymentDate}
                                onChange={(e: any) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomField
                                fullWidth
                                label="Referencia (Opcional)"
                                placeholder="Número de referencia..."
                                value={paymentData.reference}
                                onChange={(e: any) => setPaymentData({...paymentData, reference: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notas (Opcional)"
                                placeholder="Notas adicionales..."
                                value={paymentData.notes}
                                onChange={(e: any) => setPaymentData({...paymentData, notes: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                    <Button 
                        onClick={handleSavePayment}
                        variant="contained"
                        fullWidth
                        disabled={!paymentData.amount || parseFloat(paymentData.amount) <= 0}
                        sx={{
                            fontFamily: inter.style.fontFamily,
                            fontSize: '14px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#5570F1',
                            mt: 2,
                            py: 1.5
                        }}
                    >
                        Registrar Pago
                    </Button>
                </Box>
            </Dialog>
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