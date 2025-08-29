import { Box, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { SortTableIcon } from "../../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { baseService } from "../../../../utils/baseService";
import { IArticleCart, IOrder, IOrderDiscountType } from "../../../../../../api/src/interfaces";
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
                {/* Desktop Table */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
                                            Descuento
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
                            {order.articles.map((row: IArticleCart, index: number) => (
                                <TableRow
                                    key={`${row.variant._id}-${index}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}

                                >
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Box display={"flex"} alignItems={"center"}>
                                            <Box 
                                                height={49} 
                                                width={49} 
                                                minWidth={49} 
                                                borderRadius={"8px"} 
                                                border={"1px solid #00000007"} 
                                                boxShadow={"0px 0px 4px #F1F3F9"} 
                                                position={"relative"}
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => window.open(`/admin/dashboard/inventory/newArticle/${row._id}`, '_blank')}
                                            >
                                                <Image
                                                    src={row.variant.images.find(item => item.primary)?.url! || row.images.find(item => item.primary)?.url!}
                                                    fill
                                                    alt="Image articles list"
                                                    objectFit="contain"
                                                    style={{ borderRadius: "8px" }}
                                                />
                                            </Box>


                                            <Box 
                                                ml={1}
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => window.open(`/admin/dashboard/inventory/newArticle/${row._id}`, '_blank')}
                                            >
                                                <Typography 
                                                    fontFamily={"Inter"} 
                                                    fontWeight={"500"} 
                                                    color={"#5570F1"} 
                                                    fontSize={"12px"}
                                                    sx={{ "&:hover": { textDecoration: "underline" } }}
                                                >
                                                    {row.description}
                                                </Typography>
                                                <Box display="flex" flexDirection="column" gap={0.2} mt={0.5}>
                                                    <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO: {row._id}</Typography>
                                                    {row.externalCode && (
                                                        <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO EXTERNO: {row.externalCode}</Typography>
                                                    )}
                                                </Box>
                                            </Box>
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
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#FF9800"} fontSize={"12px"}>
                                            {row.orderDiscount 
                                                ? `${row.orderDiscount.value}${row.orderDiscount.type === IOrderDiscountType.PERCENT ? '%' : ' RD$'}`
                                                : '-'
                                            }
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {(() => {
                                                const itemSubTotal = row.variant.sellingPrice * row.variant.stock;
                                                const itemDiscount = row.orderDiscount 
                                                    ? (row.orderDiscount.type === IOrderDiscountType.PERCENT 
                                                        ? (itemSubTotal * row.orderDiscount.value / 100)
                                                        : row.orderDiscount.value)
                                                    : 0;
                                                return baseService.dominicanNumberFormat(itemSubTotal - itemDiscount);
                                            })()}
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            ))}

                            {order.total.discount > 0 && (
                                <TableRow key="subtotal-row">
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#8B8D97"} fontSize={"14px"}>
                                            Subtotal:
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#8B8D97"} fontSize={"14px"}>
                                            {baseService.dominicanNumberFormat(order.total.subTotal)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            
                            {order.total.discount > 0 && (
                                <TableRow key="discount-row">
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody} />
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#FF9800"} fontSize={"14px"}>
                                            Descuento:
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#FF9800"} fontSize={"14px"}>
                                            -{baseService.dominicanNumberFormat(order.total.discount)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            <TableRow key="total-row">
                                <TableCell align="left" sx={styles.tableCellBody} />
                                <TableCell align="left" sx={styles.tableCellBody} />
                                <TableCell align="left" sx={styles.tableCellBody} />
                                <TableCell align="left" sx={styles.tableCellBody}>
                                    <Typography fontFamily={"Inter"} fontWeight={"600"} color={"#2C2D33"} fontSize={"16px"}>
                                        Total:
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" sx={styles.tableCellBody}>
                                    <Typography fontFamily={"Inter"} fontWeight={"600"} color={"#2C2D33"} fontSize={"16px"}>
                                        {baseService.dominicanNumberFormat(order.total.total)}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                        </TableBody>


                    </Table>
                    </TableContainer>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {order.articles.map((row: IArticleCart, index: number) => (
                        <Card key={`mobile-${row.variant._id}-${index}`} sx={styles.mobileCard}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box 
                                        height={49} 
                                        width={49} 
                                        minWidth={49} 
                                        borderRadius="8px" 
                                        border="1px solid #00000007" 
                                        boxShadow="0px 0px 4px #F1F3F9" 
                                        position="relative" 
                                        mr={2}
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => window.open(`/admin/dashboard/inventory/newArticle/${row._id}`, '_blank')}
                                    >
                                        <Image
                                            src={row.variant.images.find(item => item.primary)?.url! || row.images.find(item => item.primary)?.url!}
                                            fill
                                            alt="Image articles list"
                                            objectFit="contain"
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </Box>
                                    <Box 
                                        flex={1}
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => window.open(`/admin/dashboard/inventory/newArticle/${row._id}`, '_blank')}
                                    >
                                        <Typography 
                                            sx={{
                                                ...styles.mobileCardTitle,
                                                color: "#5570F1",
                                                "&:hover": { textDecoration: "underline" }
                                            }}
                                        >
                                            {row.description}
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap={0.2} mt={0.5}>
                                            <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO: {row._id}</Typography>
                                            {row.externalCode && (
                                                <Typography fontFamily={"Inter"} fontSize={"10px"} color={"#8B8D97"} fontWeight={400}>CÓDIGO EXTERNO: {row.externalCode}</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Precio Unidad:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{baseService.dominicanNumberFormat(row.variant.sellingPrice)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Unidades:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.variant.stock}</Typography>
                                </Box>
                                {row.orderDiscount && (
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography sx={styles.mobileCardLabel}>Descuento:</Typography>
                                        <Typography sx={{...styles.mobileCardValue, color: '#FF9800'}}>
                                            {row.orderDiscount.value}{row.orderDiscount.type === IOrderDiscountType.PERCENT ? '%' : ' RD$'}
                                        </Typography>
                                    </Box>
                                )}
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={styles.mobileCardLabel}>Total:</Typography>
                                    <Typography sx={styles.mobileCardValue}>
                                        {(() => {
                                            const itemSubTotal = row.variant.sellingPrice * row.variant.stock;
                                            const itemDiscount = row.orderDiscount 
                                                ? (row.orderDiscount.type === IOrderDiscountType.PERCENT 
                                                    ? (itemSubTotal * row.orderDiscount.value / 100)
                                                    : row.orderDiscount.value)
                                                : 0;
                                            return baseService.dominicanNumberFormat(itemSubTotal - itemDiscount);
                                        })()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {/* Mobile Total Card */}
                    <Card sx={{ ...styles.mobileCard, backgroundColor: '#F8F9FF', border: '1px solid #5570F1' }}>
                        <CardContent sx={styles.mobileCardContent}>
                            {order.total.discount > 0 && (
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={{ ...styles.mobileCardLabel, color: '#8B8D97' }}>Subtotal:</Typography>
                                    <Typography sx={{ ...styles.mobileCardValue, color: '#8B8D97' }}>{baseService.dominicanNumberFormat(order.total.subTotal)}</Typography>
                                </Box>
                            )}
                            {order.total.discount > 0 && (
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={{ ...styles.mobileCardLabel, color: '#FF9800' }}>Descuento:</Typography>
                                    <Typography sx={{ ...styles.mobileCardValue, color: '#FF9800' }}>-{baseService.dominicanNumberFormat(order.total.discount)}</Typography>
                                </Box>
                            )}
                            <Box display="flex" justifyContent="space-between">
                                <Typography sx={{ ...styles.mobileCardLabel, fontWeight: 600, color: '#2C2D33' }}>Total General:</Typography>
                                <Typography sx={{ ...styles.mobileCardValue, fontWeight: 600, color: '#2C2D33' }}>{baseService.dominicanNumberFormat(order.total.total)}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
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
    },
    mobileCard: {
        mb: 2,
        borderRadius: "12px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)"
    },
    mobileCardContent: {
        padding: "16px !important"
    },
    mobileCardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
        fontWeight: "600",
        color: "#2C2D33",
        flex: 1
    },
    mobileCardLabel: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
        fontWeight: "500",
        color: "#8B8D97"
    },
    mobileCardValue: {
        fontFamily: inter.style.fontFamily,
        fontSize: "14px",
        fontWeight: "400",
        color: "#6E7079"
    }
}