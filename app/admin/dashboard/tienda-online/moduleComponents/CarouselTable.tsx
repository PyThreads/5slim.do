import { Box, Button, Card, CardContent, Checkbox, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { SortTableIcon } from "../../../../../components/icons/Svg";
import { Inter } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import { carouselStoreService } from "../carouselStoreService";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

export default function CarouselTable({
    setFilters,
    rows,
    currentPage,
    limit,
    totalItems,
    totalPages,
    onDoubleClickRow
}: {
    rows: any[],
    currentPage: number,
    limit: number
    totalItems: number,
    totalPages: number,
    setFilters: Function
    onDoubleClickRow: Function
}) {
    const [checked, setChecked] = useState<string[]>([]);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; slide: any | null }>({ open: false, slide: null });

    const handleDeleteClick = (slide: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ open: true, slide });
    };

    const handleConfirmDelete = async () => {
        if (deleteModal.slide) {
            try {
                await carouselStoreService.deleteCarousel(deleteModal.slide._id);
                setFilters((prev: any) => ({ ...prev })); // Refresh table
                setDeleteModal({ open: false, slide: null });
            } catch (error) {
                // Error handled by service
            }
        }
    };

    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"}>
            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"} spacing={1}>
                <Grid item xs={12} md={5} lg={5}>
                    <Typography fontFamily={inter.style.fontFamily} fontSize={{ xs: 13, sm: 16, md: 16 }} color={"#45464E"}>
                        Slides del Carousel
                    </Typography>
                </Grid>
            </Grid>

            <Grid item xs={12} mt={2}>
                {/* Desktop Table */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <TableContainer component={Paper} sx={styles.tableContainer}>
                        <Table size="small" aria-label="carousel table" sx={styles.table}>
                            <TableHead sx={{ padding: 0 }}>
                                <TableRow sx={styles.tableRow}>
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
                                        />
                                    </TableCell>
                                    <TableCell>Imagen</TableCell>
                                    <TableCell>
                                        <Box display={"flex"} alignItems={"center"}>
                                            <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#2C2D33"} mr={1}>
                                                Título
                                            </Typography>
                                            <SortTableIcon filled />
                                        </Box>
                                    </TableCell>
                                    <TableCell>Precio</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ borderBottom: "1px solid #E1E2E9" }}>
                                {rows.map((row: any) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                        onDoubleClick={() => onDoubleClickRow(row)}
                                    >
                                        <TableCell align="left" sx={styles.tableCellBody}>
                                            <Checkbox
                                                checked={checked.some(item => row._id === item)}
                                                sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setChecked(checked.some(item => row._id === item) 
                                                        ? checked.filter(item => item !== row._id) 
                                                        : [...checked, row._id]
                                                    );
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="left" sx={styles.tableCellBody}>
                                            <Box position="relative" width={80} height={45}>
                                                <Image
                                                    src={row.image || '/placeholder.jpg'}
                                                    alt={row.title}
                                                    fill
                                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left" sx={styles.tableCellBody}>
                                            <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                                {row.title || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" sx={styles.tableCellBody}>
                                            <Typography fontFamily={inter.style.fontFamily} fontWeight={"400"} color={"#6E7079"} fontSize={"14px"}>
                                                {row.price || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" sx={styles.tableCellBody}>
                                            <Typography 
                                                fontFamily={inter.style.fontFamily} 
                                                fontWeight={"400"} 
                                                color={"#6E7079"} 
                                                fontSize={"14px"}
                                                sx={{ 
                                                    maxWidth: 200, 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.description || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={styles.tableCellBody}>
                                            <IconButton 
                                                size="small" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDoubleClickRow(row);
                                                }}
                                                sx={{ color: '#5570F1', mr: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={(e) => handleDeleteClick(row, e)}
                                                sx={{ color: '#F64B3C' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {rows.map((row: any) => (
                        <Card key={row._id} sx={styles.mobileCard} onClick={() => onDoubleClickRow(row)}>
                            <CardContent sx={styles.mobileCardContent}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6" sx={styles.mobileCardTitle}>
                                        {row.title || 'N/A'}
                                    </Typography>
                                    <Checkbox
                                        checked={checked.some(item => row._id === item)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChecked(checked.some(item => row._id === item) 
                                                ? checked.filter(item => item !== row._id) 
                                                : [...checked, row._id]
                                            );
                                        }}
                                        sx={{ '&.Mui-checked': { color: "#5570F1" } }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Precio:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.price || 'N/A'}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography sx={styles.mobileCardLabel}>Descripción:</Typography>
                                    <Typography sx={styles.mobileCardValue}>{row.description || 'N/A'}</Typography>
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
                                onChange={(e) => setFilters((prev: any) => ({ ...prev, limit: e.target.value, page: 1 }))}
                                sx={{
                                    width: 80,
                                    height: 36,
                                    outline: "none",
                                    border: "none",
                                    color: "#8B8D97",
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiOutlinedInput-input": { padding: 0 }
                                }}
                            >
                                {[5, 10, 25, 50, 100].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Typography variant="h6" fontFamily={inter.style.fontFamily} fontSize={"14px"} fontWeight={"400"} color={"#8B8D97"} ml={3}>
                            Items por página
                        </Typography>
                    </Box>

                    <Box display={"flex"}>
                        <TablePagination
                            component="div"
                            count={totalItems}
                            page={currentPage - 1}
                            rowsPerPage={limit}
                            rowsPerPageOptions={[]}
                            labelDisplayedRows={({ page }) => (
                                <Typography
                                    component="span"
                                    fontFamily={inter.style.fontFamily}
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
                                setFilters((prev: any) => ({ ...prev, page: newPage + 1 }));
                                setChecked([]);
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

            {/* Delete Confirmation Modal */}
            <Dialog
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, slide: null })}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Box 
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#FEF2F2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <WarningIcon sx={{ fontSize: 32, color: '#EF4444' }} />
                        </Box>
                        <Typography 
                            fontFamily={inter.style.fontFamily} 
                            fontSize={20} 
                            fontWeight={600} 
                            color="#1F2937"
                        >
                            Eliminar Slide
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography 
                        fontFamily={inter.style.fontFamily} 
                        fontSize={16} 
                        color="#6B7280"
                        mb={2}
                    >
                        ¿Estás seguro de que deseas eliminar este slide?
                    </Typography>
                    
                    {deleteModal.slide && (
                        <Box 
                            sx={{
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid #E5E7EB'
                            }}
                        >
                            <Typography 
                                fontFamily={inter.style.fontFamily} 
                                fontSize={14} 
                                fontWeight={600} 
                                color="#374151"
                                mb={1}
                            >
                                {deleteModal.slide.title}
                            </Typography>
                            <Typography 
                                fontFamily={inter.style.fontFamily} 
                                fontSize={12} 
                                color="#6B7280"
                            >
                                Esta acción no se puede deshacer
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, px: 3 }}>
                    <Button
                        onClick={() => setDeleteModal({ open: false, slide: null })}
                        variant="outlined"
                        sx={{
                            borderColor: '#D1D5DB',
                            color: '#6B7280',
                            fontFamily: inter.style.fontFamily,
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                borderColor: '#9CA3AF',
                                backgroundColor: '#F9FAFB'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{
                            backgroundColor: '#EF4444',
                            color: 'white',
                            fontFamily: inter.style.fontFamily,
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#DC2626'
                            }
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

const styles = {
    tableContainer: {
        borderRadius: "0px !important",
        border: "none",
        boxShadow: "none",
        padding: "0px !important"
    },
    tableCellBody: {
        padding: "8px !important",
        border: "none",
        height: "60px"
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
            padding: "8px !important",
            height: "52px"
        }
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
};