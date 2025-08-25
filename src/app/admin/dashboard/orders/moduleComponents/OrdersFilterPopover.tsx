import React, { useState } from "react";
import { Button, Popover, Box, FormControlLabel, Checkbox, Typography, Divider } from "@mui/material";
import { FilterIcon } from "../../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { IOrderStatus, IPaymentStatus } from "../../../../../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface OrdersFilterPopoverProps {
    onFilterChange: (filters: { paymentStatus?: IPaymentStatus; status?: IOrderStatus }) => void;
    currentFilters?: { paymentStatus?: IPaymentStatus; status?: IOrderStatus };
}

const OrdersFilterPopover: React.FC<OrdersFilterPopoverProps> = ({ onFilterChange, currentFilters }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [tempFilters, setTempFilters] = useState({
        paymentStatus: currentFilters?.paymentStatus,
        status: currentFilters?.status
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClear = () => {
        const clearedFilters = { paymentStatus: undefined, status: undefined };
        setTempFilters(clearedFilters);
        onFilterChange(clearedFilters);
        handleClose();
    };

    const handleFilterChange = (newFilters: any) => {
        setTempFilters(newFilters);
        onFilterChange(newFilters);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Button 
                variant="outlined" 
                onClick={handleClick}
                fullWidth
                sx={{
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
                    color: "#53545C",
                    width: '100%'
                }}
                startIcon={<FilterIcon filled />}
            >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>Filtros</Box>
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableScrollLock
                sx={{
                    '& .MuiPopover-paper': {
                        borderRadius: '8px',
                        padding: '16px',
                        minWidth: '250px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Box>
                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Estado de Pago
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.paymentStatus === IPaymentStatus.PAID}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, paymentStatus: e.target.checked ? IPaymentStatus.PAID : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Pagadas</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.paymentStatus === IPaymentStatus.PARTIALLY_PAID}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, paymentStatus: e.target.checked ? IPaymentStatus.PARTIALLY_PAID : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Parcialmente Pagadas</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.paymentStatus === IPaymentStatus.NOT_PAID}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, paymentStatus: e.target.checked ? IPaymentStatus.NOT_PAID : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>No Pagadas</Typography>}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Estado de Orden
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.status === IOrderStatus.DELIVERED}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, status: e.target.checked ? IOrderStatus.DELIVERED : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Entregadas</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.status === IOrderStatus.PREPARING_FOR_DELIVERY}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, status: e.target.checked ? IOrderStatus.PREPARING_FOR_DELIVERY : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Preparando</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.status === IOrderStatus.CANCELLED}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, status: e.target.checked ? IOrderStatus.CANCELLED : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Canceladas</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.status === IOrderStatus.PENDING}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, status: e.target.checked ? IOrderStatus.PENDING : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Pendientes</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.status === IOrderStatus.SENT}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, status: e.target.checked ? IOrderStatus.SENT : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Enviadas</Typography>}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClear}
                            fullWidth
                            sx={{
                                fontSize: "12px",
                                fontFamily: inter.style.fontFamily,
                                textTransform: "none",
                                borderColor: "#CFD3D4",
                                color: "#6E7079"
                            }}
                        >
                            Limpiar
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default OrdersFilterPopover;