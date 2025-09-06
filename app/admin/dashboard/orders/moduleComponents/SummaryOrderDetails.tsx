import { Box, Grid, Typography, TextField, IconButton } from "@mui/material";
import { UserIconOrder, LocationPinIcon, CreditCardIcon } from "../../../../../components/icons/Svg";
import { IOrder } from "../../../../../api/src/interfaces";
import { baseService } from "../../../../utils/baseService";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { ordersService } from "../ordersService";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function SummaryOrderDetails({ order, onOrderUpdate }: { order: IOrder, onOrderUpdate?: (updatedOrder: IOrder) => void }) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentValue, setCommentValue] = useState(order.comment || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveComment = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const updatedOrder = await ordersService.updateComment({ orderId: order._id, comment: commentValue });
            if (onOrderUpdate) {
                onOrderUpdate(updatedOrder);
            }
            setIsEditingComment(false);
        } catch (error) {
            // Error is handled in the service
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setCommentValue(order.comment || '');
        setIsEditingComment(false);
    };
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
                                    <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} mt={0.1} >{order.client.fullName}</Typography>
                                    <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} mt={0.5} >
                                        Cliente desde
                                        <Typography component={"span"} fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px", width: "90%", marginLeft: 4} }} fontWeight={300} display={"inline"} ml={0.5}>{baseService.formatLetters(order.client.createdDate)}</Typography>
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid xs={2} justifyItems={"flex-end"}>
                                <Typography sx={{ paddingLeft: 1, paddingRight: 1, paddingTop: 0.5, paddingBottom: 0.5 }} bgcolor={"#FFF2E2"} borderRadius={"8px"} fontFamily={inter.style.fontFamily} color={"#45464E"} fontSize={"12px"} fontWeight={400} >{order.status}</Typography>
                            </Grid>

                        </Grid>

                        <Grid item container spacing={1} mt={"32px"}>

                            <Grid item xs={6} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Contacto</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px"}}} fontWeight={500} >{order.client.address?.phone || order.client.phone || 'N/A'}</Typography>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={6} >
                                <Box padding={0} margin={0}>
                                    <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Email</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >{order.client.email}</Typography>
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
                                        if (order.client.address?.isMap) {
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
                                    <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Dirección</Typography>
                                    <Box >
                                        <Grid item container alignItems={"center"} >
                                            <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >{order.client.address ? baseService.fullAddress(order.client.address) : 'N/A'}</Typography>
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

                            {order.payments && order.payments.length > 0 ? (
                                <Grid item xs={12}>
                                    <Box padding={0} margin={0}>
                                        <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Métodos Usados</Typography>
                                        <Box >
                                            <Grid item container alignItems={"center"} >
                                                <Typography fontFamily={inter.style.fontFamily} color={"#45464E"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >
                                                    {order.payments.map((p:any) => p.method).join(', ')}
                                                </Typography>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Box padding={0} margin={0}>
                                        <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"12px"} fontWeight={300} >Estado</Typography>
                                        <Box >
                                            <Grid item container alignItems={"center"} >
                                                <Typography fontFamily={inter.style.fontFamily} color={"#dc3545"} sx={{ fontSize: { xs: "11px", sm: "12px",width:"90%"}}} fontWeight={500} >
                                                    Sin pagos registrados
                                                </Typography>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}


                        </Grid>

                    </Box>
                </Grid>
            </Grid>

            {/* Comentario Section */}
            <Grid container item xs={12} spacing={2} mt={1}>
                <Grid item xs={12}>
                    <Box borderRadius={"12px"} padding={"11px 15px"} margin={0} width={"100%"} bgcolor={"#FFF"} >
                        <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>
                            <Typography fontFamily={inter.style.fontFamily} color={"#8B8D97"} fontSize={"14px"} fontWeight={500}>Comentario</Typography>
                            {!isEditingComment && (
                                <IconButton 
                                    size="small" 
                                    onClick={() => setIsEditingComment(true)}
                                    sx={{ color: "#5570F1" }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Grid>
                        
                        <Box mt={1}>
                            {isEditingComment ? (
                                <Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={commentValue}
                                        onChange={(e) => setCommentValue(e.target.value)}
                                        placeholder="Escribe un comentario..."
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '12px',
                                                fontFamily: inter.style.fontFamily
                                            }
                                        }}
                                    />
                                    <Box display="flex" gap={1} mt={1}>
                                        <IconButton 
                                            size="small" 
                                            onClick={handleSaveComment}
                                            disabled={isSaving}
                                            sx={{ 
                                                color: "#28a745",
                                                backgroundColor: "#28a74520",
                                                '&:hover': { backgroundColor: "#28a74530" }
                                            }}
                                        >
                                            <SaveIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            onClick={handleCancelEdit}
                                            sx={{ 
                                                color: "#dc3545",
                                                backgroundColor: "#dc354520",
                                                '&:hover': { backgroundColor: "#dc354530" },
                                                width: 32,
                                                height: 32
                                            }}
                                        >
                                            ×
                                        </IconButton>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography 
                                    fontFamily={inter.style.fontFamily} 
                                    color={order.comment ? "#45464E" : "#8B8D97"} 
                                    sx={{ fontSize: { xs: "11px", sm: "12px" } }} 
                                    fontWeight={400}
                                    fontStyle={order.comment ? "normal" : "italic"}
                                >
                                    {order.comment || "Sin comentarios"}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </Grid >
    )
}

