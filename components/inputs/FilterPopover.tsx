import React, { useState } from "react";
import { Button, Popover, Box, FormControlLabel, Checkbox, Typography, Divider } from "@mui/material";
import { FilterIcon } from "../icons/Svg";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface FilterPopoverProps {
    onFilterChange: (filters: { published?: boolean; hasStock?: boolean; lowStock?: boolean }) => void;
    currentFilters?: { published?: boolean; hasStock?: boolean; lowStock?: boolean };
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ onFilterChange, currentFilters }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [tempFilters, setTempFilters] = useState({
        published: currentFilters?.published,
        hasStock: currentFilters?.hasStock,
        lowStock: currentFilters?.lowStock
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleApply = () => {
        onFilterChange(tempFilters);
        handleClose();
    };

    const handleClear = () => {
        const clearedFilters = { published: undefined, hasStock: undefined, lowStock: undefined };
        setTempFilters(clearedFilters);
        onFilterChange(clearedFilters);
        handleClose();
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
                        Estado de publicación
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.published === true}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, published: e.target.checked ? true : undefined }))}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Solo publicados</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.published === false}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, published: e.target.checked ? false : undefined }))}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Solo no publicados</Typography>}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Disponibilidad
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.hasStock === true}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, hasStock: e.target.checked ? true : undefined }))}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Con stock</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.hasStock === false}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, hasStock: e.target.checked ? false : undefined }))}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Sin stock</Typography>}
                    />
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tempFilters.lowStock === true}
                                onChange={(e) => setTempFilters(prev => ({ ...prev, lowStock: e.target.checked ? true : undefined }))}
                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                            />
                        }
                        label={<Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', color: '#6E7079' }}>Stock bajo</Typography>}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
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
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApply}
                            fullWidth
                            sx={{
                                fontSize: "12px",
                                fontFamily: inter.style.fontFamily,
                                textTransform: "none",
                                backgroundColor: "#5570F1",
                                "&:hover": { backgroundColor: "#5570F1" }
                            }}
                        >
                            Aplicar filtro
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default FilterPopover;