import React, { useState, useEffect } from "react";
import { IconButton, Popover, Box, Typography, Autocomplete, TextField, Button, MenuItem } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import { Inter } from "next/font/google";
import { categoriesService } from "../../src/app/admin/dashboard/categories/categoriesService";
import { brandsService } from "../../src/app/admin/dashboard/brands/brandsService";
import { ICategory, IBrand } from "../../api/src/interfaces";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface SearchFilterPopoverProps {
    onFilterChange: (filters: { categories?: number[]; brand?: number; size?: string }) => void;
    currentFilters?: { categories?: number[]; brand?: number; size?: string };
}

const SearchFilterPopover: React.FC<SearchFilterPopoverProps> = ({ onFilterChange, currentFilters }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [tempFilters, setTempFilters] = useState({
        categories: currentFilters?.categories || [],
        brand: currentFilters?.brand || "",
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

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilterChange = (newFilters: any) => {
        setTempFilters(newFilters);
        onFilterChange(newFilters);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton 
                onClick={handleClick}
                sx={{
                    color: "#53545C",
                    border: "1px solid #53545C",
                    borderRadius: "4px",
                    width: "33px",
                    height: "33px"
                }}
            >
                <FilterListIcon fontSize="small" />
            </IconButton>
            
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableScrollLock
                sx={{
                    '& .MuiPopover-paper': {
                        borderRadius: '8px',
                        padding: '16px',
                        minWidth: '280px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Box>
                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '14px', fontWeight: 600, mb: 2, color: '#2C2D33' }}>
                        Filtros de búsqueda
                    </Typography>
                    
                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', fontWeight: 500, mb: 1, color: '#6E7079' }}>
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
                            mb: 2,
                            '& .MuiChip-root': {
                                fontSize: '10px',
                                height: '24px'
                            }
                        }}
                    />

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', fontWeight: 500, mb: 1, color: '#6E7079' }}>
                        Marcas
                    </Typography>
                    
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={tempFilters.brand || ''}
                        onChange={(e) => {
                            const newFilters = { ...tempFilters, brand: e.target.value ? parseInt(e.target.value) : undefined };
                            handleFilterChange(newFilters);
                        }}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                fontSize: '12px',
                                fontFamily: inter.style.fontFamily
                            }
                        }}
                    >
                        <MenuItem value="">Todas las marcas</MenuItem>
                        {brands.map((brand) => (
                            <MenuItem key={brand._id} value={brand._id}>
                                {brand.description}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography sx={{ fontFamily: inter.style.fontFamily, fontSize: '12px', fontWeight: 500, mb: 1, color: '#6E7079' }}>
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

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                const clearedFilters = { categories: [], brand: "", size: "" };
                                setTempFilters(clearedFilters);
                                onFilterChange({ categories: [], brand: undefined, size: "" });
                            }}
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

export default SearchFilterPopover;