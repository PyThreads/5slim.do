import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { SortTableIcon } from "../../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { baseService } from "../../../../utils/baseService";
import { IArticleCart, IOrder } from "../../../../../../api/src/interfaces";
import Image from "next/image";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableOrderDetailList(
    {
        order
    }
        :
        {
            order: IOrder
        }
) {

    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                <Typography fontFamily={"Inter"} fontSize={"16px"} fontWeight={"500"} color="#45464E">Articulos
                    <Typography fontFamily={"Inter"} component={"span"} ml={0.5} color={"#5570f1"}>{order.articles.length}</Typography>
                </Typography>

            </Grid>

            <Grid item xs={12} mt={2}>
                <TableContainer component={Paper} sx={styles.tableContainer}>
                    <Table size="small" aria-label="a dense table" sx={styles.table}>
                        <TableHead sx={{ padding: 0 }}>
                            <TableRow
                                sx={styles.tableRow}
                            >

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nombre del Artículo
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Precio Unidad
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Unid.
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Total
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>



                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                            {order.articles.map((row: IArticleCart) => (
                                <TableRow
                                    key={row.variant._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}

                                >
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Box display={"flex"} alignItems={"center"}>
                                            <Box height={49} width={49} minWidth={49} borderRadius={"8px"} border={"1px solid #00000007"} boxShadow={"0px 0px 4px #F1F3F9"} position={"relative"} >
                                                <Image
                                                    src={row.variant.images.find(item => item.primary)?.url! || "/Image.svg"}
                                                    fill
                                                    alt="Image articles list"
                                                    objectFit="contain"
                                                    style={{ borderRadius: "8px" }}
                                                />
                                            </Box>


                                            <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"} ml={1}>
                                                {row.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>


                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {baseService.dominicanNumberFormat(row.variant.sellingPrice)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.variant.stock}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {baseService.dominicanNumberFormat(row.variant.sellingPrice * row.variant.stock)}
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell align="left" sx={styles.tableCellBody} />
                                <TableCell align="left" sx={styles.tableCellBody} />
                                <TableCell align="left" sx={styles.tableCellBody}>
                                    <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#2C2D33"} fontSize={"16px"}>
                                        Total:
                                    </Typography>
                                </TableCell>

                                <TableCell align="left" sx={styles.tableCellBody}>
                                    <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#2C2D33"} fontSize={"16px"}>
                                        {baseService.dominicanNumberFormat(order.total.total)}
                                    </Typography>
                                </TableCell>

                            </TableRow>

                        </TableBody>


                    </Table>

                </TableContainer>


            </Grid>

        </Box >
    )
}

const styles = {
    tableContainer: {
        borderRadius: "0px !important",
        border: "none",
        boxShadow: "none",
        padding: "0px !important"
    },
    tableCellBody: {
        padding: "0px !important",
        border: "none",
        height: "48px"
    },
    table: {
        borderRadius: "0px !important",
        boxShadow: "none !important",
        border: "none !important",
        minWidth: 650,
        padding: "0px !important"
    },
    tableRow: {
        "& th": {
            borderTop: "1px solid #E1E2E9",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "1px solid #E1E2E9",
            padding: "0px !important",
            height: "52px"
        }
    },
    btnAdd: {
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "33px",
        textTransform: "none",
        borderRadius: "4px",
        padding: "8px",
        "&:hover": {
            backgroundColor: "transparent",
        },
        borderColor: "#53545C",
        color: "#53545C"
    }
}