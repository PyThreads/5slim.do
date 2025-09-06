import { Box, Button, Card, CardContent, Checkbox, Grid, Link, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Chip } from "@mui/material";
import { SortTableIcon } from "../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LabelIcon from '@mui/icons-material/Label';
import { Inter } from "next/font/google";
import { useState } from "react";
import SearchTable from "../../../../../components/inputs/SearchTable";
import { ordersService } from "../ordersService";
import { baseService } from "../../../../utils/baseService";
import { IOrder, IOrderStatus, IPaymentStatus, IPaginateOrders } from "../../../../../api/src/interfaces";
import OrdersFilterPopover from "./OrdersFilterPopover";

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
        onOrdersUpdated,
        currentFilter
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
            currentFilter?: { paymentStatus?: IPaymentStatus; status?: IOrderStatus }
        }
) {
    const [checked, setChecked] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


    const handleMarkAsDelivered = async () => {
        if (checked.length === 0) return;
        
        const validOrderIds = checked.filter(orderId => {
            const order = rows.find(row => row._id === orderId);
            return order && order.status !== IOrderStatus.CANCELLED;
        });
        
        if (validOrderIds.length === 0) return;
        
        try {
            await ordersService.bulkUpdateOrderStatus({ 
                orderIds: validOrderIds, 
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
        
        const validOrderIds = checked.filter(orderId => {
            const order = rows.find(row => row._id === orderId);
            return order && order.status !== IOrderStatus.CANCELLED;
        });
        
        if (validOrderIds.length === 0) return;
        
        try {
            await ordersService.bulkUpdateOrderStatus({ 
                orderIds: validOrderIds, 
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

    const handlePrint4x3 = async () => {
        if (checked.length === 0) return;
        
        try {
            for (const orderId of checked) {
                await ordersService.printOrder4x3(orderId);
            }
            setAnchorEl(null);
        } catch (error) {
            // Error is handled in the service
        }
    };





    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container spacing={2} alignItems="center">

                <Grid item xs={12} md={4}>
                    <Typography fontFamily={inter.style.fontFamily} fontSize={{ xs: 13, sm: 16, md: 16 }} color={"#45464E"}>Órdenes De Clientes</Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Grid container spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <SearchTable onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFilers((prev: any) => ({ ...prev, fullClient: e.target.value, page: 1 }))
                            }} />
                        </Grid>

                        <Grid item xs={6} sm={3} md={2}>
                            <OrdersFilterPopover 
                                onFilterChange={(filters) => {
                                    setFilers((prev: any) => ({ ...prev, ...filters, page: 1 }))
                                }}
                                currentFilters={{ paymentStatus: currentFilter?.paymentStatus, status: currentFilter?.status }}
                            />
                        </Grid>
                        
                        <Grid item xs={6} sm={3} md={2}>
                            <Button 
                                variant="outlined" 
                                sx={{ ...styles.btnAdd, width: '100%' }}
                                endIcon={<KeyboardArrowDownIcon fontSize="medium" />}
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                disabled={checked.length === 0}
                            >
                                <Box sx={{ display: { xs: "none", sm: "block" } }}>Acciones</Box>
                            </Button>
                        </Grid>
                        
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
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nº
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Nombre del cliente
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Fecha de orden
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#45464E"} mr={1}>
                                            Estado de Pago
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Artículos
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Estado
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                            Pagos
                                        </Typography>
                                        <SortTableIcon filled />
                                    </Box>
                                </TableCell>

                                <TableCell >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
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
                                            <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#5570F1"} fontSize={"12px"}>
                                                {row._id}
                                            </Typography>
                                        </Link>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {row.client.fullName}
                                        </Typography>
                                    </TableCell>


                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {ordersService.formatAmPmLetters(row.createdDate)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography 
                                            fontFamily={inter.style.fontFamily} 
                                            fontWeight={"500"} 
                                            fontSize={"12px"}
                                            color={
                                                row.paymentStatus === IPaymentStatus.PAID ? "#519C66" :
                                                row.paymentStatus === IPaymentStatus.PARTIALLY_PAID ? "#FF9800" : "#CC5F5F"
                                            }
                                        >
                                            {row.paymentStatus || 'No Pagado'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {row.articles.length}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Box>
                                            <Typography 
                                                fontFamily={inter.style.fontFamily} 
                                                fontWeight={"500"} 
                                                fontSize={"12px"}
                                                color={
                                                    row.paymentStatus === IPaymentStatus.PAID ? "#519C66" :
                                                    row.paymentStatus === IPaymentStatus.PARTIALLY_PAID ? "#FF9800" : "#CC5F5F"
                                                }
                                                mb={0.5}
                                            >
                                                {row.paymentStatus}
                                            </Typography>
                                            {row.payments && row.payments.length > 0 && (
                                                <Box component="ul" sx={{ margin: 0, paddingLeft: 2, fontSize: "11px" }}>
                                                    {row.payments.map((payment, index) => (
                                                        <Box component="li" key={index} sx={{ color: "#8B8D97", fontSize: "10px" }}>
                                                            {payment.method}: {baseService.dominicanNumberFormat(payment.amount)}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>

                                    <TableCell align="left" sx={styles.tableCellBody}>
                                        <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"12px"}
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
                        <Card key={row._id} sx={styles.mobileCard} onClick={() => onDoubleClickRow(row)}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Box flex={1}>
                                        <Typography variant="h6" sx={styles.mobileCardTitle}>
                                            {row.client.fullName}
                                        </Typography>
                                        <Link 
                                            href={`/admin/dashboard/orders/${row._id}`}
                                            target="_blank"
                                            sx={{ textDecoration: 'none', color: '#5570F1', '&:hover': { textDecoration: 'underline' } }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Typography sx={{ ...styles.mobileCardValue, color: "#5570F1", fontSize: "12px" }}>#{row._id}</Typography>
                                        </Link>
                                    </Box>
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
                                    <Typography sx={styles.mobileCardLabel}>Fecha:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{ordersService.formatAmPmLetters(row.createdDate)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Estado de Pago:</Typography>
                                    <Chip 
                                        label={row.paymentStatus || 'No Pagado'}
                                        size="small"
                                        sx={{
                                            backgroundColor: row.paymentStatus === IPaymentStatus.PAID ? "#E8F5E8" :
                                                           row.paymentStatus === IPaymentStatus.PARTIALLY_PAID ? "#FFF3E0" : "#FFEBEE",
                                            color: row.paymentStatus === IPaymentStatus.PAID ? "#519C66" :
                                                   row.paymentStatus === IPaymentStatus.PARTIALLY_PAID ? "#FF9800" : "#CC5F5F",
                                            fontWeight: "500",
                                            fontSize: "11px"
                                        }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Artículos:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.articles.length}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Estado:</Typography>
                                    <Chip 
                                        label={row.status}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: "11px",
                                            height: "24px"
                                        }}
                                    />
                                </Box>

                                {row.payments && row.payments.length > 0 && (
                                    <Box mb={1}>
                                        <Typography sx={styles.mobileCardLabel}>Pagos:</Typography>
                                        <Box component="ul" sx={{ margin: 0, paddingLeft: 2, fontSize: "11px" }}>
                                            {row.payments.map((payment, index) => (
                                                <Box component="li" key={index} sx={{ color: "#8B8D97", fontSize: "10px" }}>
                                                    {payment.method}: {baseService.dominicanNumberFormat(payment.amount)}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                <Box display="flex" justifyContent="space-between">
                                    <Typography sx={styles.mobileCardLabel}>Total:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{baseService.dominicanNumberFormat(row.total.total)}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} justifyContent={"space-between"} alignItems={{ xs: "stretch", sm: "center" }} gap={{ xs: 2, sm: 0 }}>

                    <Box display={"flex"} alignItems={"center"} justifyContent={{ xs: "center", sm: "flex-start" }}>

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

                        <Typography variant="h6" fontFamily={inter.style.fontFamily} fontSize={{ xs: "12px", sm: "14px" }} fontWeight={"400"} color={"#8B8D97"} ml={{ xs: 2, sm: 3 }}>
                            Items por página
                        </Typography>


                    </Box>

                    <Box display={"flex"} justifyContent={{ xs: "center", sm: "flex-end" }}>

                        <TablePagination
                            component="div"
                            count={totalItems!} // total de elementos
                            page={currentPage! - 1} // ajustamos a base 0
                            rowsPerPage={limit}
                            rowsPerPageOptions={[]} // si no quieres mostrar opciones
                            labelDisplayedRows={({ page }) => (
                                <Typography
                                    component="span"
                                    fontFamily={inter.style.fontFamily}
                                    fontSize={{ xs: "12px", sm: "14px" }}
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
                                '& .MuiTablePagination-toolbar': {
                                    minHeight: { xs: '40px', sm: '52px' },
                                    paddingLeft: { xs: '8px', sm: '16px' },
                                    paddingRight: { xs: '8px', sm: '16px' }
                                }
                            }}
                        />

                    </Box>

                </Box>


            </Grid>

            {/* Actions Popover */}
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
                    {checked.length > 0 && (
                        <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 1 }}>
                            <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={400} color={"#45464E"}>
                                Total envío: {baseService.dominicanNumberFormat(
                                    rows.filter(order => checked.includes(order._id))
                                        .reduce((sum, order) => sum + (order.shipment || 0), 0)
                                )}
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                        onClick={handlePrintOrders}
                    >
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                            Imprimir facturas ({checked.length})
                        </Typography>
                        <LocalPrintshopIcon fontSize="small" />
                    </Box>

                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                        onClick={handlePrintLabels}
                    >
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                            Imprimir labels ({checked.length})
                        </Typography>
                        <LabelIcon fontSize="small" />
                    </Box>

                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                        onClick={handlePrint4x3}
                    >
                        <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                            Imprimir 4x3 ({checked.length})
                        </Typography>
                        <LocalPrintshopIcon fontSize="small" />
                    </Box>

                    {(() => {
                        const selectedOrders = rows.filter(order => checked.includes(order._id));
                        const nonCancelledOrders = selectedOrders.filter(order => order.status !== IOrderStatus.CANCELLED);
                        
                        if (nonCancelledOrders.length > 0) {
                            return (
                                <>
                                    {(() => {
                                        const canMarkAsDelivered = nonCancelledOrders.some(order => order.status !== IOrderStatus.DELIVERED);
                                        
                                        if (canMarkAsDelivered) {
                                            return (
                                                <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                    onClick={handleMarkAsDelivered}
                                                >
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                        Marcar como entregado ({nonCancelledOrders.length})
                                                    </Typography>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {(() => {
                                        const canMarkAsSent = nonCancelledOrders.some(order => 
                                            [IOrderStatus.PENDING, IOrderStatus.PREPARING_FOR_DELIVERY].includes(order.status)
                                        );
                                        
                                        if (canMarkAsSent) {
                                            return (
                                                <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer",":hover":{backgroundColor:"#F1F1F1"}} } mb={1}
                                                    onClick={handleMarkAsSent}
                                                >
                                                    <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#45464E"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                                                        Marcar como enviado ({nonCancelledOrders.filter(order => [IOrderStatus.PENDING, IOrderStatus.PREPARING_FOR_DELIVERY].includes(order.status)).length})
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
        fontSize: { xs: "12px", sm: "14px" },
        fontFamily: inter.style.fontFamily,
        height: { xs: "30px", sm: "33px" },
        textTransform: "none",
        borderRadius: "4px",
        padding: { xs: "4px 8px", sm: "8px" },
        minWidth: { xs: "auto", sm: "80px" },
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
        border: "1px solid #F0F0F0",
        "&:hover": {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
            borderColor: "#5570F1"
        }
    },
    mobileCardContent: {
        padding: "16px !important",
        "&:last-child": {
            paddingBottom: "16px !important"
        }
    },
    mobileCardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: "16px",
        fontWeight: "600",
        color: "#2C2D33",
        marginBottom: "4px"
    },
    mobileCardLabel: {
        fontFamily: inter.style.fontFamily,
        fontSize: "13px",
        fontWeight: "500",
        color: "#8B8D97"
    },
    mobileCardValue: {
        fontFamily: inter.style.fontFamily,
        fontSize: "13px",
        fontWeight: "400",
        color: "#6E7079"
    }
}