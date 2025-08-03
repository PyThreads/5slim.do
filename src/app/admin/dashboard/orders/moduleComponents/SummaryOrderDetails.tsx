import { Box, Grid, Typography } from "@mui/material";
import { UserIconOrder, LocationPinIcon, CreditCardIcon } from "../../../../../../components/icons/Svg";
import { IOrder } from "../../../../../../api/src/interfaces";
import { baseService } from "../../../../utils/baseService";

export default function SummaryOrderDetails({ order }: { order: IOrder }) {
    return (
        <Grid container spacing={2}>

            <Grid container item xs={12} sm={12} md={12} lg={9} spacing={2}>

                <Grid item xs={12} sm={6}>
                    <Grid borderRadius={"12px"} padding={"11px 15px"} minHeight={"170px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                        <Grid container item xs={12} justifyContent={"space-between"}>

                            <Grid xs={2} >
                                <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <UserIconOrder />
                                </Box>
                            </Grid>

                            <Grid xs={8}>
                                <Grid item>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} mt={0.1} >{order.client.fullName}</Typography>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} mt={0.5} >
                                        Cliente desde
                                        <Typography component={"span"} fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} display={"inline"} ml={0.5}>{baseService.formatLetters(order.client.createdDate)}</Typography>
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid xs={2} justifyItems={"flex-end"}>
                                <Typography sx={{ paddingLeft: 1, paddingRight: 1, paddingTop: 0.5, paddingBottom: 0.5 }} bgcolor={"#FFF2E2"} borderRadius={"8px"} fontFamily={"Inter"} color={"#45464E"} fontSize={"12px"} fontWeight={400} >{order.status}</Typography>
                            </Grid>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={6} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Contacto</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px"}}} fontWeight={500} >{order.client.address.phone}</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={6} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Email</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >{order.client.email}</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>


                <Grid container item xs={12} sm={6}>
                    <Grid borderRadius={"12px"} padding={"11px 15px"} minHeight={"170px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                        <Grid container item xs={12} justifyContent={"space-between"}>

                            <Grid xs={12} >
                                <Box bgcolor={"#ffcc9140"} width={36} height={36} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (order.client.address.isMap) {
                                            window.open(order.client.address.map?.url, "_blank")
                                        }
                                    }
                                    }
                                >
                                    <LocationPinIcon />
                                </Box>
                            </Grid>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={12}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Dirección</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >{baseService.fullAddress(order.client.address)}</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={6} md={12} lg={3} spacing={2}>
                <Grid item xs={12}>
                    <Box borderRadius={"12px"} padding={"11px 15px"} minHeight={"170px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                        <Grid container item xs={12} justifyContent={"space-between"}>

                            <Grid xs={12} >
                                <Box bgcolor={"#ffcc9140"} width={36} height={36} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <CreditCardIcon />
                                </Box>
                            </Grid>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={12}>
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={"Inter"} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Tipo de Pago</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={"Inter"} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >{order.paymentType}</Typography>
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

