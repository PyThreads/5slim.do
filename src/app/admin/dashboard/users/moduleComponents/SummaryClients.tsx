import { Box, Grid, Typography } from "@mui/material";
import { CustomersIcon, ShoppingBagIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCallback, useEffect, useState } from "react";
import SplashScreen from "../../../../providers/SplashScreen";
import React from "react";
import { userService } from "../userService";

export default function SummaryClients() {

    const [loading, setLoading] = useState(false);
    const [totalClients, setTotalClients] = useState(0);

    const loadClientsSummary = useCallback(async () => {
        try {
            setLoading(true);
            const result = await userService.getAllClientsSummary();
            setTotalClients(result)

        } finally {
            setLoading(false)
        }
    }, [setLoading, userService, setTotalClients])

    useEffect(() => {
        loadClientsSummary();
    }, [loadClientsSummary])

    return (
        <React.Fragment>
            {
                loading ?

                    (
                        <SplashScreen />
                    )

                    :

                    (
                        <Grid container spacing={2}>

                            <Grid container item xs={12} md={6} >
                                <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                                    <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                                        <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                            <CustomersIcon filled={false} strokeBold />
                                        </Box>

                                        <Box sx={{ cursor: "pointer" }}>
                                            <Grid item container alignItems={"center"} >
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"12px"} fontWeight={400} >Esta semana </Typography>
                                                <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#BEC0CA" }} />
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    <Grid item container spacing={1} mt={"32px"}>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Todos </Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{userService.decimalNumber(totalClients)}</Typography>
                                                        {/* <Typography fontFamily={"Inter"} color={"#519C66"} fontSize={"12px"} fontWeight={500} ml={1} > + 15.80% </Typography> */}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Activos </Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{userService.decimalNumber(totalClients)}</Typography>
                                                        {/* // <Typography fontFamily={"Inter"} color={"#519C66"} fontSize={"12px"} fontWeight={500} ml={1} > + 85% </Typography> */}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>


                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Inactivos </Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{userService.decimalNumber(0)}</Typography>
                                                        {/* <Typography fontFamily={"Inter"} color={"#519C66"} fontSize={"12px"} fontWeight={500} ml={1} > - 10% </Typography> */}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                    </Grid>

                                </Box>
                            </Grid>


                            <Grid container item xs={12} md={6} >
                                <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                                    <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                                        <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                            <ShoppingBagIcon filled={false} strokeBold />
                                        </Box>

                                        <Box sx={{ cursor: "pointer" }}>
                                            <Grid item container alignItems={"center"}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"12px"} fontWeight={400} >Esta semana </Typography>
                                                <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#BEC0CA" }} />
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    <Grid item container spacing={1} mt={"32px"}>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Nuevos Clientes </Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{userService.decimalNumber(totalClients)}</Typography>
                                                        {/* <Typography fontFamily={"Inter"} color={"#519C66"} fontSize={"12px"} fontWeight={500} ml={1} >+20%</Typography> */}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Online </Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{userService.decimalNumber(0)}</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>


                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Compras pendientes</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >0</Typography>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                    </Grid>

                                </Box>
                            </Grid>
                        </Grid>
                    )
            }
        </React.Fragment>
    )
}

