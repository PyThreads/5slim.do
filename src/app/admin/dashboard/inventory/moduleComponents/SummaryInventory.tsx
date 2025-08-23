import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { ArticlesIcons, CustomersIcon } from "../../../../../../components/icons/Svg";
import { useCallback, useEffect, useState } from "react";
import { IArticlesSummary } from "../../../../../../api/src/interfaces";
import React from "react";
import { articleService } from "../articleService";


export default function SummaryInventory({ reload = false }: { reload: boolean }) {

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<IArticlesSummary>({
        total: 0,
        outOfStock: 0,
        soldToday: 0,
        lowStockAlert: 0
    });


    const getSummary = useCallback(async () => {
        try {
            setLoading(true);
            const summary = await articleService.summaryArticles();
            setSummary(summary);
        } finally {
            setLoading(false);
        }
    }, [setSummary, setLoading])


    useEffect(() => {
        getSummary();
    }, [reload, getSummary])

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
                                                        {loading ? (
                                                            <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                                        ) : (
                                                            <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"20px"} fontWeight={500} >{articleService.decimalNumber(summary.total)}</Typography>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"14px"} fontWeight={400} >Activos</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        {loading ? (
                                                            <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                                        ) : (
                                                            <>
                                                                <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"20px"} fontWeight={500} >{articleService.decimalNumber(summary.total)}</Typography>
                                                                <Typography fontFamily={"Inter"} color={"#FFF"} fontSize={"12px"} fontWeight={500} ml={1} >100%</Typography>
                                                            </>
                                                        )}
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
                                                        {loading ? (
                                                            <Skeleton variant="text" width={40} height={30} />
                                                        ) : (
                                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{articleService.decimalNumber(summary.lowStockAlert)}</Typography>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Agotados</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        {loading ? (
                                                            <Skeleton variant="text" width={40} height={30} />
                                                        ) : (
                                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{articleService.decimalNumber(summary.outOfStock)}</Typography>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>


                                        <Grid item xs={6} sm={4}>
                                            <Box padding={0} margin={0}>
                                                <Typography fontFamily={"Inter"} color={"#BEC0CA"} fontSize={"14px"} fontWeight={500} >Vendidos hoy</Typography>
                                                <Box sx={{ cursor: "pointer" }}>
                                                    <Grid item container alignItems={"center"} >
                                                        {loading ? (
                                                            <Skeleton variant="text" width={40} height={30} />
                                                        ) : (
                                                            <Typography fontFamily={"Inter"} color={"#45464E"} fontSize={"20px"} fontWeight={500} >{articleService.decimalNumber(summary.soldToday)}</Typography>
                                                        )}
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

