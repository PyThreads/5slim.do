"use client";
import { Box, Button, Grid, Popover, Typography } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ShoppingBagIcon } from "../../../../../../components/icons/Svg";
import { useCallback, useEffect, useState } from "react";
import { IOrdersSummary } from "../../../../../../api/src/interfaces";
import React from "react";
import { ordersService } from "../ordersService";
import SplashScreen from "../../../../providers/SplashScreen";
import CustomField from "../../../../../../components/inputs/CustomField";
import { Inter } from "next/font/google";
import { baseService } from "../../../../utils/baseService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function SummaryOrders({reloadSummary}:{reloadSummary:boolean}) {

    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [filter, setFilter] = useState<{ from: Date, to: Date }>({ from: baseService.dayjs(baseService.newDate()).startOf("month").toDate(), to: baseService.newDate() }); 
    const [orderSummary, setOrderSummary] = useState<IOrdersSummary>({
        total: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        paid: 0,
        partiallyPaid: 0,
        preparingForDelivery: 0,
        earnings: 0,
        totalSold: 0
    });

    const getOrdersSummary = useCallback(async () => {
        setLoading(true);
        setAnchorEl(null);
        const result = await ordersService.ordersSummary(filter);
        setOrderSummary(result);
        setLoading(false);
    }, [setLoading, setOrderSummary,filter,setAnchorEl])

    useEffect(() => {
        getOrdersSummary();
    }, [reloadSummary, getOrdersSummary])


    return (
        <React.Fragment>
            {
                loading ? (
                    <SplashScreen />
                ) : (
                    <Grid container spacing={2}>

                        <Grid container item xs={12} spacing={2}>

                            <Grid container item xs={12} sm={6} md={4}>
                                <Box borderRadius={"12px"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                                    <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                                        <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                            <ShoppingBagIcon filled={false} strokeBold color="#000" />
                                        </Box>

                                        <Box sx={{ cursor: "pointer" }}>
                                            <Grid item container alignItems={"center"} >
                                                <TuneIcon fontSize="medium" sx={{ color: "#BEC0CA" }} onClick={(e: any) => setAnchorEl(e.currentTarget)} />
                                            </Grid>
                                        </Box>

                                    </Grid>

                                    <Grid item container spacing={1} mt={"32px"}>

                                        <Grid item xs={4} >
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={400} >Total</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.total)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={4} >
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={400} >Pendiente</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.pending)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={4} >
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={400} >Preparando</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.preparingForDelivery)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                    </Grid>

                                </Box>
                            </Grid>


                            <Grid container item xs={12} sm={6} md={4}>
                                <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                                    <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                                        <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                            <ShoppingBagIcon filled={false} strokeBold color="#000" />
                                        </Box>

                                    </Grid>

                                    <Grid item container spacing={1} mt={"32px"}>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={400} >Cancelada</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.cancelled)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={500} >Entregada</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.delivered)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>


                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={500} >Pagada</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.paid)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={12} >
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "12px", sm: "10px", md: "12px", lg: "14px" } }} fontWeight={500} noWrap>Pagos Incompletos</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.decimalNumber(orderSummary.partiallyPaid)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                    </Grid>

                                </Box>
                            </Grid>

                            <Grid container item spacing={2} xs={12} sm={6} md={4}>
                                <Grid container item xs={12}>
                                    <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                                        <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                                            <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                <AttachMoneyIcon sx={{color: "#000"}} />
                                            </Box>

                                        </Grid>

                                        <Grid item container spacing={1} mt={"32px"}>

                                             <Grid item xs={6} >
                                                <Box padding={0} margin={0}>
                                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={500} >Ventas</Typography>
                                                    <Box sx={{ cursor: "pointer" }}>
                                                        <Grid item container alignItems={"center"} >
                                                             <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.dominicanNumberFormat(orderSummary.totalSold)}</Typography>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Box padding={0} margin={0}>
                                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} sx={{ fontSize: { xs: "15px", sm: "12px", md: "14px", lg: "16px" } }} fontWeight={400} >Ganancias</Typography>
                                                    <Box sx={{ cursor: "pointer" }}>
                                                        <Grid item container alignItems={"center"} >
                                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ xs: "17px", md: "20px" }} fontWeight={500} >{ordersService.dominicanNumberFormat(orderSummary.earnings)}</Typography>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                        </Grid>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid >
                )

            }

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
            >
                <Box p={1} width={200}>

                    <Typography variant="h6" gutterBottom component="div" fontFamily={"Inter"} color={"#BEC0CA"} fontWeight={500} fontSize={"15px"}>Filtrar por fecha</Typography>

                    <Typography variant="h6" gutterBottom component="div" fontFamily={"Inter"} color={"#BEC0CA"} fontWeight={500} fontSize={"12px"} mt={1}>Desde:</Typography>
                    <CustomField value={baseService.dateToLocal(filter.from)} noValidate name="from" label="" type="date" fullWidth
                        onChange={(e: any) => {
                            setFilter({
                                ...filter,
                                from: baseService.localTimeToDate(e.target.value)
                            })
                        }}
                    />

                    <Typography variant="h6" gutterBottom component="div" fontFamily={"Inter"} color={"#BEC0CA"} fontWeight={500} fontSize={"12px"} mt={1}>Hasta:</Typography>
                    <CustomField value={baseService.dateToLocal(filter.to)} noValidate name="to" label="" type="date" fullWidth
                        onChange={(e: any) => {
                            setFilter({
                                ...filter,
                                to: baseService.localTimeToDate(e.target.value)
                            })
                        }}
                    />

                    <Button variant="contained" sx={{ ...style.addButton }} fullWidth
                    onClick={getOrdersSummary}
                    >
                        Aplicar
                    </Button>

                </Box>
            </Popover>
        </React.Fragment>
    )
}

const style = {
    addButton: {
        backgroundColor: "#5570F1",
        mt: 2,
        fontSize: { xs: 12, sm: 14, md: 16 },
        fontFamily: inter.style.fontFamily,
        height: "36px",
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    }
}