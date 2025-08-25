import React, { useState, useEffect } from "react";
import { Button, Popover, Box, FormControlLabel, Checkbox, Typography, Divider, Select, MenuItem, FormControl, Autocomplete, TextField } from "@mui/material";
import { FilterIcon } from "../icons/Svg";
import { Inter } from "next/font/google";
import { categoriesService } from "../../src/app/admin/dashboard/categories/categoriesService";
import { brandsService } from "../../src/app/admin/dashboard/brands/brandsService";
import { ICategory, IBrand } from "../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface FilterPopoverProps {
    onFilterChange: (filters: { hasStock?: boolean; lowStock?: boolean; hasOrderedVariants?: boolean; sortByOrders?: string; categories?: number[]; brand?: number; size?: string }) => void;
    currentFilters?: { hasStock?: boolean; lowStock?: boolean; hasOrderedVariants?: boolean; sortByOrders?: string; categories?: number[]; brand?: number; size?: string };
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ onFilterChange, currentFilters }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [tempFilters, setTempFilters] = useState({
        hasStock: currentFilters?.hasStock,
        lowStock: currentFilters?.lowStock,
        hasOrderedVariants: currentFilters?.hasOrderedVariants,
        sortByOrders: currentFilters?.sortByOrders,
        categories: currentFilters?.categories || [],
        brand: currentFilters?.brand || undefined,
        size: currentFilters?.size || ""
    });

    useEffect(() => {
        const loadData = async () => {
            const [categoriesResult, brandsResult] = await Promise.all([
                categoriesService.getAllCategories({ limit: 100 }),
                brandsService.getAllBrands({ limit: 100 })
            ]);
            setCategories(categoriesResult.list as ICategory[]);
            setBrands(brandsResult.list as IBrand[]);
        };
        loadData();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleClear = () => {
        const clearedFilters = { hasStock: undefined, lowStock: undefined, hasOrderedVariants: undefined, sortByOrders: undefined, categories: [], brand: undefined, size: "" };
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
                    color: "#53545C",
                    minWidth: { xs: '100%', sm: 'auto' },
                    width: '100%'
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
                        Categorías
                    </Typography>
                    
                    <Autocomplete
                        multiple
                        size="small"
                        options={categories}
                        getOptionLabel={(option) => option.description}
                        getOptionKey={(option) => option._id}
                        value={categories.filter(cat => tempFilters.categories?.includes(cat._id))}
                        onChange={(_, newValue) => {
                            const categoryIds = newValue.map(cat => cat._id);
                            const newFilters = { ...tempFilters, categories: categoryIds };
                            handleFilterChange(newFilters);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Seleccionar categorías"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '12px',
                                        fontFamily: inter.style.fontFamily
                                    }
                                }}
                            />
                        )}
                        sx={{
                            '& .MuiChip-root': {
                                fontSize: '10px',
                                height: '24px'
                            }
                        }}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Marcas
                    </Typography>
                    
                    <FormControl fullWidth size="small">
                        <Select
                            value={tempFilters.brand || ''}
                            onChange={(e) => {
                                const newFilters = { ...tempFilters, brand: e.target.value ? parseInt(e.target.value as string) : undefined };
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
                            <MenuItem value="" sx={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>Todas las marcas</MenuItem>
                            {brands.map((brand) => (
                                <MenuItem key={brand._id} value={brand._id} sx={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>
                                    {brand.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Talla
                    </Typography>
                    
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Filtrar por talla"
                        value={tempFilters.size}
                        onChange={(e) => {
                            const newFilters = { ...tempFilters, size: e.target.value };
                            handleFilterChange(newFilters);
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: '12px',
                                fontFamily: inter.style.fontFamily
                            }
                        }}
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

export default FilterPopover;