import { Box, Button, Card, CardContent, Checkbox, Grid, Link, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { FilterDateIcon, FilterIcon, SortTableIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LabelIcon from '@mui/icons-material/Label';
import { Inter } from "next/font/google";
import { useState } from "react";
import SearchTable from "../../../../../../components/inputs/SearchTable";
import { ordersService } from "../ordersService";
import { baseService } from "../../../../utils/baseService";
import { IOrder, IOrderStatus } from "../../../../../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableOrderList(
    {
        setFilers,
        rows,
        currentPage,
        limit,
        totalItems,
        totalPages,
        onDoubleClickRow,
        onOrdersUpdated
    }
        :
        {
            rows: IOrder[],
            currentPage: number,
            limit: number
            totalItems: number,
            totalPages: number,
            setFilers: Function
            onDoubleClickRow: Function
            onOrdersUpdated?: Function
        }
) {
    const [checked, setChecked] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


    const handleMarkAsDelivered = async () => {
        if (checked.length === 0) return;
        
        try {
            await ordersService.bulkUpdateOrderStatus({ 
                orderIds: checked, 
                status: IOrderStatus.DELIVERED 
            });
            setChecked([]);
            setAnchorEl(null);
            if (onOrdersUpdated) onOrdersUpdated();
        } catch (error) {
            // Error is handled in the service
        }
    };

    const handleMarkAsSent = async () => {
        if (checked.length === 0) return;
        
        try {
            await ordersService.bulkUpdateOrderStatus({ 
                orderIds: checked, 
                status: IOrderStatus.SENT 
            });
            setChecked([]);
            setAnchorEl(null);
            if (onOrdersUpdated) onOrdersUpdated();
        } catch (error) {
            // Error is handled in the service
        }
    };

    const handlePrintOrders = async () => {
        if (checked.length === 0) return;
        
        try {
            for (const orderId of checked) {
                await ordersService.printOrder(orderId);
            }
            setAnchorEl(null);
        } catch (error) {
            // Error is handled in the service
        }
    };

    const handlePrintLabels = async () => {
        if (checked.length === 0) return;
        
        try {
            for (const orderId of checked) {
                await ordersService.printOrderLabel(orderId);
            }
            setAnchorEl(null);
        } catch (error) {
            // Error is handled in the service
        }
    };



    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"} spacing={1}>

                <Grid item xs={12} md={5} lg={5} >
                    <Typography fontFamily={"Inter"}>Órdenes De Clientes</Typography>
                </Grid>

                <Grid container item display={"flex"} alignItems={"center"}  xs={12} md={12} lg={7} spacing={1}>

                    <Grid item width={"250px"} m={1}>
                        <SearchTable onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFilers((prev: any) => ({ ...prev, fullClient: e.target.value, page: 1 }))
                        }} />
                    </Grid>

                    <Grid item m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Grid>

                    <Grid item m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterDateIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Grid>

                    <Grid item m={1}>
                        <Button 
                            variant="outlined" 
                            sx={{ ...styles.btnAdd }}
                            endIcon={<KeyboardArrowDownIcon fontSize="medium" />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={checked.length === 0}
                        >
                            Acciones
                        </Button>
                    </Grid>
                </Grid>

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
                                <TableCell>
                                    <Checkbox
                                        checked={checked.length === rows.length}
                                        onClick={() => {
                                            if (checked.length === rows.length) {
                                                setChecked([])
                                            } else {
                                                setChecked(rows.map(item => item._id) || [])
                                            }
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}

                                    />
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nº
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nombre del cliente
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Fecha de orden
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Tipo de pago
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Artículos
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Estado
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
                            {rows.map((row: IOrder) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: "0px !important" }}

                                >
                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Checkbox
                                            checked={checked.some(item => row._id === item)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#5570F1", // color cuando está marcado
                                                }
                                            }}
                                            onClick={() => {
                                                setChecked(checked.some(item => row._id === item) ? checked.filter(item => item !== row._id) : [...checked, row._id])
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Link 
                                            href={`/admin/dashboard/orders/${row._id}`}
                                            target="_blank"
                                            sx={{ textDecoration: 'none', color: '#5570F1', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#5570F1"} fontSize={"14px"}>
                                                {row._id}
                                            </Typography>
                                        </Link>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.client.fullName}
                                        </Typography>
                                    </TableCell>


                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {ordersService.formatAmPmLetters(row.createdDate)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.paymentType}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.articles.length}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={"Inter"} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}
                                        >
                                            {baseService.dominicanNumberFormat(row.total.total)}
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    </TableContainer>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {rows.map((row: IOrder) => (
                        <Card key={row._id} sx={styles.mobileCard}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6" sx={styles.mobileCardTitle}>
                                        {row.client.fullName}
                                    </Typography>
                                    <Checkbox
                                        checked={checked.some(item => row._id === item)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChecked(checked.some(item => row._id === item) ? checked.filter(item => item !== row._id) : [...checked, row._id]);
                                        }}
                                        sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Nº:</Typography>
                                    <Link 
                                        href={`/admin/dashboard/orders/${row._id}`}
                                        target="_blank"
                                        sx={{ textDecoration: 'none', color: '#5570F1', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        <Typography sx={styles.mobileCardValue} color="#5570F1">{row._id}</Typography>
                                    </Link>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Fecha:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{ordersService.formatAmPmLetters(row.createdDate)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Tipo de pago:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.paymentType}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Artículos:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.articles.length}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Estado:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.status}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={styles.mobileCardLabel}>Total:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{baseService.dominicanNumberFormat(row.total.total)}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

                    <Box display={"flex"} alignItems={"center"}>

                        <Box sx={{ backgroundColor: "#5E636614" }}
                            padding="0px 11px"
                            width={"60px"}
                            height={"23px"}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderRadius={"8px"}
                        >

                            <Select
                                value={limit}
                                size="small"
                                variant="outlined"
                                onChange={(e) => setFilers((prev: any) => ({ ...prev, limit: e.target.value, page: 1 }))}
                                sx={{
                                    width: 80,
                                    height: 36,
                                    outline: "none",
                                    border: "none",
                                    color: "#8B8D97",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none"
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: 0,
                                    }
                                }}
                            >
                                {[5, 10, 25, 50, 100].map((option) => (
                                    <MenuItem key={option} value={option} color="#8B8D97">
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>

                        </Box>

                        <Typography variant="h6" fontFamily={"Inter"} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} ml={3}>
                            Items por página
                        </Typography>


                    </Box>

                    <Box display={"flex"}>

                        <TablePagination
                            component="div"
                            count={totalItems!} // total de elementos
                            page={currentPage! - 1} // ajustamos a base 0
                            rowsPerPage={limit}
                            rowsPerPageOptions={[]} // si no quieres mostrar opciones
                            labelDisplayedRows={({ page }) => (
                                <Typography
                                    component="span"
                                    fontFamily={"Inter"}
                                    fontSize={"14px"}
                                    fontWeight={"400"}
                                    color={"#666666"}
                                    ml={2}
                                >
                                    {`${page + 1} de ${totalPages} Páginas`}
                                </Typography>
                            )}
                            labelRowsPerPage={""}
                            onPageChange={(_, newPage) => {
                                setFilers((prev: any) => ({ ...prev, page: newPage + 1 }));
                                setChecked([])
                            }}
                            sx={{
                                '& .MuiTablePagination-actions button': {
                                    color: '#8B8D97',
                                },
                            }}
                        />

                    </Box>

                </Box>


            </Grid>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        borderRadius: '8px',
                        padding: '16px',
                        minWidth: '220px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Box p={1}>
                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                        onClick={handlePrintOrders}
                    >
                        <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                            Imprimir facturas ({checked.length})
                        </Typography>
                        <LocalPrintshopIcon fontSize="small" />
                    </Box>

                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                        onClick={handlePrintLabels}
                    >
                        <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                            Imprimir labels ({checked.length})
                        </Typography>
                        <LabelIcon fontSize="small" />
                    </Box>

                    {(() => {
                        const selectedOrders = rows.filter(order => checked.includes(order._id));
                        const allCancelled = selectedOrders.every(order => order.status === IOrderStatus.CANCELLED);
                        
                        if (!allCancelled) {
                            return (
                                <>
                                    {(() => {
                                        const canMarkAsDelivered = selectedOrders.some(order => order.status !== IOrderStatus.DELIVERED);
                                        
                                        if (canMarkAsDelivered) {
                                            return (
                                                <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                    onClick={handleMarkAsDelivered}
                                                >
                                                    <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                        Marcar como entregado ({checked.length})
                                                    </Typography>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {(() => {
                                        const canMarkAsSent = selectedOrders.every(order => 
                                            [IOrderStatus.PAID, IOrderStatus.PENDING, IOrderStatus.PREPARING_FOR_DELIVERY].includes(order.status)
                                        );
                                        
                                        if (canMarkAsSent) {
                                            return (
                                                <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                    onClick={handleMarkAsSent}
                                                >
                                                    <Typography fontFamily={"Inter"} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                        Marcar como enviado ({checked.length})
                                                    </Typography>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })()
                                    }
                                </>
                            );
                        }
                        return null;
                    })()}
                </Box>
            </Popover>



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
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        "&:hover": {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)"
        }
    },
    mobileCardContent: {
        padding: "16px !important"
    },
    mobileCardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "16px",
        fontWeight: "600",
        color: "#2C2D33"
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