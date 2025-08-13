import React, { useState } from "react";
import { Button, Popover, Box, FormControlLabel, Checkbox, Typography, Divider, Select, MenuItem, FormControl } from "@mui/material";
import { FilterIcon } from "../icons/Svg";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface FilterPopoverProps {
    onFilterChange: (filters: { hasStock?: boolean; lowStock?: boolean; hasOrderedVariants?: boolean; sortByOrders?: string }) => void;
    currentFilters?: { hasStock?: boolean; lowStock?: boolean; hasOrderedVariants?: boolean; sortByOrders?: string };
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ onFilterChange, currentFilters }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [tempFilters, setTempFilters] = useState({
        hasStock: currentFilters?.hasStock,
        lowStock: currentFilters?.lowStock,
        hasOrderedVariants: currentFilters?.hasOrderedVariants,
        sortByOrders: currentFilters?.sortByOrders
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleClear = () => {
        const clearedFilters = { hasStock: undefined, lowStock: undefined, hasOrderedVariants: undefined, sortByOrders: undefined };
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
                sx={{
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
                }}
                startIcon={<FilterIcon filled />}
            >
                Filtrar
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
                        minWidth: '220px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Box>

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Disponibilidad
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.hasStock === true}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, hasStock: e.target.checked ? true : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Con stock</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.hasStock === false}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, hasStock: e.target.checked ? false : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Sin stock</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.lowStock === true}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, lowStock: e.target.checked ? true : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Alerta stock</Typography>}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Variantes encargadas
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.hasOrderedVariants === true}
                                onChange={(e) => {
                                    const newFilters = { ...tempFilters, hasOrderedVariants: e.target.checked ? true : undefined };
                                    handleFilterChange(newFilters);
                                }}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Con variantes encargadas</Typography>}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Ordenar por ventas
                    </Typography>
                    
                    <FormControl fullWidth size="small">
                        <Select
                            value={tempFilters.sortByOrders || ''}
                            onChange={(e) => {
                                const newFilters = { ...tempFilters, sortByOrders: e.target.value || undefined };
                                handleFilterChange(newFilters);
                            }}
                            displayEmpty
                            sx={{
                                fontSize: '12px',
                                fontFamily: inter.style.fontFamily,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CFD3D4'
                                }
                            }}
                        >
                            <MenuItem value="" sx={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>Sin ordenar</MenuItem>
                            <MenuItem value="desc" sx={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>Más vendido primero</MenuItem>
                            <MenuItem value="asc" sx={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>Menos vendido primero</MenuItem>
                        </Select>
                    </FormControl>

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

export default FilterPopover;