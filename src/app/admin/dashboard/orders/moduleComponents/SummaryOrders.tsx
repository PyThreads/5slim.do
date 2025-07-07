import { Box, Grid, Typography } from "@mui/material";
import { ShoppingBagIcon, CustomersIcon, ShoppingCartIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function SummaryOrders() {
    return (
        <Grid container spacing={2}>

            <Grid container item xs={12} sm={9} md={9}  spacing={2}>

                <Grid container item xs={12} sm={6}>
                    <Box borderRadius={"12px"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                        <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                            <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <ShoppingBagIcon filled={false} strokeBold color="#000" />
                            </Box>

                            <Box sx={{ cursor: "pointer" }}>
                                <Grid item container alignItems={"center"} >
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"12px"} fontWeight={400} >Esta semana </Typography>
                                    <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#BEC0CA" }} />
                                </Grid>
                            </Box>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={4} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"14px"} fontWeight={400} >All Orders</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >450</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={4} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"14px"} fontWeight={400} >Pending</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >5 </Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={4} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"14px"} fontWeight={400} >Pending</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >5 </Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>

                    </Box>
                </Grid>


                <Grid container item xs={12} sm={6}>
                    <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                        <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                            <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <ShoppingBagIcon filled={false} strokeBold color="#000" />
                            </Box>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={6} sm={4}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={400} >Alerta Stock</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >30</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={6} sm={4}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Agotados</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >657</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>


                            <Grid item xs={6} sm={4}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Vendidos hoy</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >5</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>

                    </Box>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={3} md={3}  spacing={2}>
                <Grid container item xs={12}>
                    <Box borderRadius={"12px"} bgcolor={"#FFFFFF"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} >
                        <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                            <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <ShoppingCartIcon   />
                            </Box>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={6}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={400} >Alerta Stock</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >30</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={6} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Agotados</Typography>
                                    <Box sx={{ cursor: "pointer" }}>
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >657</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>


                        </Grid>

                    </Box>
                </Grid>
            </Grid>

        </Grid >
    )
}

