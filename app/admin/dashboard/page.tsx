"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { Inter } from "next/font/google";
import { ArticlesIcons, CustomersIcon, ShoppingBagIcon } from "../../../components/icons/Svg";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SplashScreen from "../../providers/SplashScreen";
import { ordersService } from "./orders/ordersService";
import { userService } from "./users/userService";
import { articleService } from "./inventory/articleService";
import { baseService } from "../../utils/baseService";
import { IOrdersSummary, IArticlesSummary, IOrder, IOrderStatus } from "../../../api/src/interfaces";
import { useRouter } from "next/navigation";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function DashboardPage(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [ordersSummary, setOrdersSummary] = useState<IOrdersSummary>({
        total: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        sent: 0,
        paid: 0,
        partiallyPaid: 0,
        preparingForDelivery: 0,
        earnings: 0,
        totalSold: 0
    });
    const [articlesSummary, setArticlesSummary] = useState<IArticlesSummary>({
        total: 0,
        outOfStock: 0,
        soldToday: 0,
        lowStockAlert: 0
    });
    const [totalClients, setTotalClients] = useState(0);
    const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const filter = { 
                from: baseService.dayjs(baseService.newDate()).startOf("month").toDate(), 
                to: baseService.newDate() 
            };
            
            const [orders, articles, clients, recent] = await Promise.all([
                ordersService.ordersSummary(filter),
                articleService.summaryArticles(),
                userService.getAllClientsSummary(),
                ordersService.getAllOrders({ page: 1, limit: 10 })
            ]);
            
            setOrdersSummary(orders);
            setArticlesSummary(articles);
            setTotalClients(clients);
            setRecentOrders(recent.list || []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Revenue Overview */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box sx={styles.iconBox}>
                                    <AttachMoneyIcon sx={styles.icon} />
                                </Box>
                                <TrendingUpIcon sx={{ color: "#519C66", fontSize: 20 }} />
                            </Box>
                            <Typography sx={styles.cardTitle}>Ingresos del Mes</Typography>
                            <Typography sx={styles.cardValue}>
                                {baseService.dominicanNumberFormat(ordersSummary.totalSold)}
                            </Typography>
                            <Typography sx={styles.cardSubtext}>Ganancias: {baseService.dominicanNumberFormat(ordersSummary.earnings)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Orders Overview */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box sx={styles.iconBox}>
                                    <ShoppingBagIcon filled={false} strokeBold color="#5570F1" />
                                </Box>
                                <Typography sx={styles.badge}>
                                    {ordersSummary.pending} Pendientes
                                </Typography>
                            </Box>
                            <Typography sx={styles.cardTitle}>Órdenes Totales</Typography>
                            <Typography sx={styles.cardValue}>{ordersSummary.total}</Typography>
                            <Typography sx={styles.cardSubtext}>Entregadas: {ordersSummary.delivered}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Clients Overview */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box sx={styles.iconBox}>
                                    <CustomersIcon filled={false} strokeBold color="#5570F1" />
                                </Box>
                                <Typography sx={styles.successBadge}>Activos</Typography>
                            </Box>
                            <Typography sx={styles.cardTitle}>Total Clientes</Typography>
                            <Typography sx={styles.cardValue}>{totalClients}</Typography>
                            <Typography sx={styles.cardSubtext}>Todos activos</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Inventory Overview */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box sx={styles.iconBox}>
                                    <ArticlesIcons filled={false} strokeBold color="#5570F1" />
                                </Box>
                                {articlesSummary.lowStockAlert > 0 && (
                                    <WarningIcon sx={{ color: "#CC5F5F", fontSize: 20 }} />
                                )}
                            </Box>
                            <Typography sx={styles.cardTitle}>Artículos</Typography>
                            <Typography sx={styles.cardValue}>{articlesSummary.total}</Typography>
                            <Typography sx={styles.cardSubtext}>
                                {articlesSummary.lowStockAlert > 0 
                                    ? `${articlesSummary.lowStockAlert} con stock bajo`
                                    : "Stock saludable"
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Detailed Orders Status */}
                <Grid item xs={12} lg={6}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Typography sx={styles.sectionTitle} mb={3}>Estado de Órdenes</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={2.4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{ordersSummary.pending}</Typography>
                                        <Typography sx={styles.statusLabel}>Pendientes</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={2.4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{ordersSummary.preparingForDelivery}</Typography>
                                        <Typography sx={styles.statusLabel}>Preparando</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={2.4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{ordersSummary.sent}</Typography>
                                        <Typography sx={styles.statusLabel}>Enviadas</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={2.4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{ordersSummary.delivered}</Typography>
                                        <Typography sx={styles.statusLabel}>Entregadas</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={2.4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{ordersSummary.cancelled}</Typography>
                                        <Typography sx={styles.statusLabel}>Canceladas</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Inventory Details */}
                <Grid item xs={12} lg={6}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Typography sx={styles.sectionTitle} mb={3}>Estado del Inventario</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={4}>
                                    <Box textAlign="center">
                                        <Typography sx={styles.statusValue}>{articlesSummary.total}</Typography>
                                        <Typography sx={styles.statusLabel}>Total</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box textAlign="center">
                                        <Typography sx={{ ...styles.statusValue, color: "#CC5F5F" }}>
                                            {articlesSummary.lowStockAlert}
                                        </Typography>
                                        <Typography sx={styles.statusLabel}>Stock Bajo</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box textAlign="center">
                                        <Typography sx={{ ...styles.statusValue, color: "#CC5F5F" }}>
                                            {articlesSummary.outOfStock}
                                        </Typography>
                                        <Typography sx={styles.statusLabel}>Agotados</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box textAlign="center">
                                        <Typography sx={{ ...styles.statusValue, color: "#519C66" }}>
                                            {articlesSummary.soldToday}
                                        </Typography>
                                        <Typography sx={styles.statusLabel}>Vendidos Hoy</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Card sx={styles.card}>
                        <CardContent sx={styles.cardContent}>
                            <Typography sx={styles.sectionTitle} mb={3}>Últimas 10 Órdenes</Typography>
                            <Box sx={styles.ordersContainer}>
                                {recentOrders.map((order) => (
                                    <Box key={order._id} sx={styles.orderItem} onDoubleClick={() => router.push(`/admin/dashboard/orders/${order._id}`)}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography sx={styles.orderClient}>
                                                    {order.client.fullName}
                                                </Typography>
                                                <Typography sx={styles.orderDate}>
                                                    {ordersService.formatAmPmLetters(order.createdDate)}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right">
                                                <Typography sx={styles.orderTotal}>
                                                    {baseService.dominicanNumberFormat(order.total.total)}
                                                </Typography>
                                                <Typography sx={{
                                                    ...styles.orderStatus,
                                                    color: order.status === IOrderStatus.DELIVERED ? '#519C66' : 
                                                           order.status === IOrderStatus.CANCELLED ? '#CC5F5F' : '#5570F1',
                                                    backgroundColor: order.status === IOrderStatus.DELIVERED ? '#519C6614' : 
                                                                   order.status === IOrderStatus.CANCELLED ? '#CC5F5F14' : '#5570F114'
                                                }}>
                                                    {order.status}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={styles.orderItems}>
                                            {order.articles.length} artículo{order.articles.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

const styles = {
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: { xs: 20, sm: 24, md: 28 },
        fontWeight: 400,
        color: "#2C2D33"
    },
    card: {
        borderRadius: "12px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        height: "100%"
    },
    cardContent: {
        padding: "20px !important"
    },
    iconBox: {
        backgroundColor: "#5570F114",
        width: 48,
        height: 48,
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        color: "#5570F1",
        fontSize: 24
    },
    cardTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: 14,
        fontWeight: 500,
        color: "#8B8D97",
        mb: 1
    },
    cardValue: {
        fontFamily: inter.style.fontFamily,
        fontSize: { xs: 20, sm: 24 },
        fontWeight: 400,
        color: "#2C2D33",
        mb: 1
    },
    cardSubtext: {
        fontFamily: inter.style.fontFamily,
        fontSize: 12,
        fontWeight: 400,
        color: "#BEC0CA"
    },
    badge: {
        backgroundColor: "#5570F114",
        color: "#5570F1",
        fontSize: 10,
        fontWeight: 500,
        padding: "4px 8px",
        borderRadius: "6px"
    },
    successBadge: {
        backgroundColor: "#519C6614",
        color: "#519C66",
        fontSize: 10,
        fontWeight: 500,
        padding: "4px 8px",
        borderRadius: "6px"
    },
    sectionTitle: {
        fontFamily: inter.style.fontFamily,
        fontSize: 16,
        fontWeight: 400,
        color: "#2C2D33"
    },
    statusValue: {
        fontFamily: inter.style.fontFamily,
        fontSize: 18,
        fontWeight: 400,
        color: "#2C2D33"
    },
    statusLabel: {
        fontFamily: inter.style.fontFamily,
        fontSize: 12,
        fontWeight: 400,
        color: "#8B8D97",
        mt: 0.5
    },
    ordersContainer: {
        maxHeight: 400,
        overflowY: "auto"
    },
    orderItem: {
        padding: "16px",
        borderBottom: "1px solid #E1E2E9",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#F8F9FA"
        },
        "&:last-child": {
            borderBottom: "none"
        }
    },
    orderClient: {
        fontFamily: inter.style.fontFamily,
        fontSize: 14,
        fontWeight: 400,
        color: "#2C2D33"
    },
    orderDate: {
        fontFamily: inter.style.fontFamily,
        fontSize: 12,
        fontWeight: 400,
        color: "#8B8D97",
        mt: 0.5
    },
    orderTotal: {
        fontFamily: inter.style.fontFamily,
        fontSize: 14,
        fontWeight: 400,
        color: "#2C2D33"
    },
    orderStatus: {
        fontFamily: inter.style.fontFamily,
        fontSize: 10,
        fontWeight: 500,
        padding: "4px 8px",
        borderRadius: "6px",
        mt: 0.5,
        display: "inline-block"
    },
    orderItems: {
        fontFamily: inter.style.fontFamily,
        fontSize: 12,
        fontWeight: 400,
        color: "#BEC0CA",
        mt: 1
    }
}