import { Box, Grid, Typography } from "@mui/material";
import { ArticlesIcons, CustomersIcon } from "../../../../../../components/icons/Svg";


export default function SummaryInventory() {
    return (
        <Grid container spacing={2}>

            <Grid container item xs={12} md={6} >
                <Box borderRadius={"12px"} padding={"11px 15px"} minHeight={"145px"} margin={0} width={"100%"} bgcolor={"#5570F1"} >
                    <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                        <Box bgcolor={"#ffcc9140"} width={50} height={50} borderRadius={"8px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <ArticlesIcons filled={false} strokeBold color="#FFF" />
                        </Box>
                    </Grid>

                    <Grid item container spacing={1} mt={"32px"}>

                        <Grid item xs={12} sm={7}>
                            <Box padding={0} margin={0}>
                                <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"14px"} fontWeight={400} >Todos</Typography>
                                <Box sx={{ cursor: "pointer" }}>
                                    <Grid item container alignItems={"center"} >
                                        <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"20px"} fontWeight={500} >1,250 </Typography>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Box padding={0} margin={0}>
                                <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"14px"} fontWeight={400} >Activos </Typography>
                                <Box sx={{ cursor: "pointer" }}>
                                    <Grid item container alignItems={"center"} >
                                        <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"20px"} fontWeight={500} >1,250 </Typography>
                                        <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"12px"} fontWeight={500} ml={1} > 86% </Typography>
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
                            <CustomersIcon filled={false} strokeBold />
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
    )
}

