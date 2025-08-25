import * as React from 'react';
import { Box, Grid, Paper, MenuItem, IconButton, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomField from '../../../../../../components/inputs/CustomField';
import { v4 as uuidv4 } from 'uuid';
import { IArticleImages, IArticleStatus, IArticlesVariants, IArticleAvailability } from '../../../../../../api/src/interfaces';
import { baseService } from '../../../../utils/baseService';
import axios from '../../../../../../context/adminAxiosInstance';
import { eventBus } from '../../../../utils/broadcaster';
import Image from 'next/image';
import { articleService } from '../articleService';

export default function TableArticleVariants({
    rows = [],
    onChange,
    mainImage,
    articleId,
}: {
    rows: IArticlesVariants[];
    onChange: Function;
    mainImage: string | undefined;
    articleId: number;
}) {
    const [loading, setLoading] = React.useState<{[key: string]: boolean}>({});
    const [variants, setVariants] = React.useState<IArticlesVariants[]>(rows);
    const [deleteConfirm, setDeleteConfirm] = React.useState<{open: boolean, variant: IArticlesVariants | null}>({open: false, variant: null});

    React.useEffect(() => {
        setVariants(rows);
    }, [rows]);
    const refInput = React.useRef<HTMLInputElement>(null);
    const refInput2 = React.useRef<HTMLInputElement>(null);

    const [newOne, setNewOne] = React.useState<Partial<IArticlesVariants>>(() => ({
        _id: uuidv4(),
        costPrice: 0,
        sellingPrice: 0,
        status: IArticleStatus.NEW,
        stock: 1,
        images: [],
        source: '',
        available: IArticleAvailability.AVAILABLE,
        comment: '',
        tracking: '',
        size: '',
    }));

    const handleChangeNewOne = (value: any, name: any, row?: IArticlesVariants | null | undefined) => {
        const result = name === 'stock' && (value === '' || value < 0) ? 0 : value;

        if (row) {
            const updatedRow: IArticlesVariants = { ...row, [name]: result };
            const arr = [...variants];
            const index = arr.findIndex((item) => item._id === updatedRow._id);
            if (index !== -1) {
                arr[index] = updatedRow;
                setVariants([...arr]);
            }
            return;
        }

        setNewOne((prev) => ({ ...prev, [name]: result }));
    };

    const addSelected = async () => {
        setLoading(prev => ({ ...prev, 'new': true }));
        try {
            for (let i = 1; i <= newOne.stock!; i++) {
                const variant = {
                    _id: uuidv4(),
                    costPrice: newOne.costPrice!,
                    sellingPrice: newOne.sellingPrice!,
                    status: IArticleStatus.NEW,
                    stock: 1,
                    images: newOne.images!,
                    source: newOne.source!,
                    available: newOne.available!,
                    comment: newOne.comment!,
                    tracking: newOne.tracking!,
                    size: newOne.size!,
                };
                await articleService.addVariant(articleId, variant);
            }
            // Reload variants after adding
            const updatedVariants = await articleService.getVariants(articleId);
            setVariants(updatedVariants);
            onChange(updatedVariants);
            setNewOne({
                _id: uuidv4(),
                costPrice: 0,
                sellingPrice: 0,
                status: IArticleStatus.NEW,
                stock: 1,
                images: [],
                source: '',
                available: IArticleAvailability.AVAILABLE,
                comment: '',
                tracking: '',
                size: ''
            });
        } catch (error) {
            console.error('Error adding variant:', error);
        } finally {
            setLoading(prev => ({ ...prev, 'new': false }));
        }
    };

    const handleDeleteClick = (variant: IArticlesVariants) => {
        setDeleteConfirm({open: true, variant});
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.variant) return;
        const variant = deleteConfirm.variant;
        setLoading(prev => ({ ...prev, [variant._id!]: true }));
        try {
            await articleService.deleteVariant(articleId, variant._id!);
            // Reload variants after deleting
            const updatedVariants = await articleService.getVariants(articleId);
            setVariants(updatedVariants);
            onChange(updatedVariants);
        } catch (error) {
            console.error('Error deleting variant:', error);
        } finally {
            setLoading(prev => ({ ...prev, [variant._id!]: false }));
            setDeleteConfirm({open: false, variant: null});
        }
    };

    const updateVariant = async (variant: IArticlesVariants) => {
        setLoading(prev => ({ ...prev, [variant._id!]: true }));
        try {
            await articleService.updateVariant(articleId, variant._id!, variant);
            // Reload variants after updating
            const updatedVariants = await articleService.getVariants(articleId);
            setVariants(updatedVariants);
            onChange(updatedVariants);
        } catch (error) {
            console.error('Error updating variant:', error);
        } finally {
            setLoading(prev => ({ ...prev, [variant._id!]: false }));
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary = false, item?: IArticlesVariants | null) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            const formData = new FormData();
            for (const i in file) {
                formData.append(i, file[i]);
            }

            const { data }: { data: any } = await axios.post('/admin/private/images/upload', formData);
            let result = data.data as IArticleImages[];

            if (isPrimary && result.length > 0) {
                result = result.map((image, index) => ({
                    ...image,
                    primary: index === 0,
                }));
            }

            if (item) {
                const arr = [...variants];
                const index = arr.findIndex((value) => item._id === value._id);
                if (index !== -1) {
                    const currentImages = arr[index].images || [];
                    const cleanedImages = currentImages.map((img) => ({ ...img, primary: false }));
                    const list = [...cleanedImages, ...result];
                    arr[index] = { ...arr[index], images: list };
                    setVariants([...arr]);
                }
                return;
            }

            const cleanedNewImages = (newOne.images || []).map((img) => ({ ...img, primary: false }));
            const newImageList = [...cleanedNewImages, ...result];

            setNewOne({
                ...newOne,
                images: newImageList,
            });
        } catch (error) {
            eventBus.emit('notify', {
                message: 'Ha ocurrido un error al subir la imagen.',
                open: true,
                type: 'error',
                title: 'Upss!',
            });
        } finally {
            if (refInput.current) refInput.current.value = '';
            if (refInput2.current) refInput2.current.value = '';
        }
    };

    const renderVariantCard = (variant: IArticlesVariants, isNew = false) => {
        const imageUrl = variant.images?.find((img) => img.primary)?.url || mainImage;

        return (
            <Paper sx={{ 
                p: 2, 
                mb: 2, 
                ...style.hideScroll,
                ...(isNew ? {
                    border: '2px solid #5570F1',
                    backgroundColor: '#F8F9FF'
                } : {})
            }} elevation={2} >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Box
                            component="label"
                            htmlFor={isNew ? 'upload-image-variant' : 'upload-image-variant-listed' + variant._id}
                            sx={{
                                width: '100%',
                                height: 80,
                                borderRadius: 2,
                                bgcolor: '#F4F5FA',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                id={isNew ? 'upload-image-variant' : 'upload-image-variant-listed' + variant._id}
                                accept="image/*"
                                multiple={false}
                                onChange={(e) => handleChange(e, true, isNew ? undefined : variant)}
                                ref={isNew ? refInput : refInput2}
                            />
                            {imageUrl && <Image fill src={imageUrl} alt="img" objectFit="contain" />}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Estado"
                                    fullWidth
                                    noValidate
                                    select
                                    name="status"
                                    value={variant.status || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value, 'status', isNew ? undefined : variant)
                                    }
                                >
                                    {Object.entries(IArticleStatus).map(([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </CustomField>
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Tracking"
                                    fullWidth
                                    noValidate
                                    type="text"
                                    name="tracking"
                                    value={variant.tracking || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value || '', 'tracking', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Disponibilidad"
                                    fullWidth
                                    noValidate
                                    select
                                    name="available"
                                    value={variant.available || IArticleAvailability.AVAILABLE}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value, 'available', isNew ? undefined : variant)
                                    }
                                >
                                    {Object.entries(IArticleAvailability).map(([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </CustomField>
                            </Grid>

                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Talla"
                                    fullWidth
                                    noValidate
                                    type="text"
                                    name="size"
                                    value={variant.size || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value || '', 'size', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Url"
                                    fullWidth
                                    noValidate
                                    type="text"
                                    name="source"
                                    value={variant.source || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value || '', 'source', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Cantidad"
                                    fullWidth
                                    noValidate
                                    type="number"
                                    name="stock"
                                    value={variant.stock || 0}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(Number(e.target.value) || '', 'stock', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Costo"
                                    fullWidth
                                    noValidate
                                    name="costPrice"
                                    type="number"
                                    value={variant.costPrice || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(Number(e.target.value) || '', 'costPrice', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Venta"
                                    fullWidth
                                    noValidate
                                    name="sellingPrice"
                                    type="number"
                                    value={variant.sellingPrice || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(Number(e.target.value) || '', 'sellingPrice', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomField
                                    size="small"
                                    label="Ganancia"
                                    fullWidth
                                    noValidate
                                    disabled
                                    value={baseService.dominicanNumberFormat(
                                        Number(variant.sellingPrice || 0) - Number(variant.costPrice || 0)
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomField
                                    size="small"
                                    label="Comentario"
                                    fullWidth
                                    noValidate
                                    multiline
                                    rows={4}
                                    name="comment"
                                    value={variant.comment || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value || '', 'comment', isNew ? undefined : variant)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} textAlign="right">
                                {isNew ? (
                                    <IconButton 
                                        onClick={addSelected}
                                        disabled={loading['new']}
                                        color="primary"
                                    >
                                        {loading['new'] ? <CircularProgress size={20} /> : <AddCircleIcon />}
                                    </IconButton>
                                ) : (
                                    <Box>
                                        <IconButton 
                                            onClick={() => updateVariant(variant)}
                                            disabled={loading[variant._id!]}
                                            color="primary"
                                            sx={{ mr: 1 }}
                                        >
                                            {loading[variant._id!] ? <CircularProgress size={20} /> : <SaveIcon />}
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDeleteClick(variant)}
                                            disabled={loading[variant._id!]}
                                            color="error"
                                        >
                                            {loading[variant._id!] ? <CircularProgress size={20} /> : <DeleteIcon />}
                                        </IconButton>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    return (
        <Box sx={{ height: "75vh" }}>
            {renderVariantCard(newOne as IArticlesVariants, true)}
            {variants.map((row, index) => <Box key={row._id || `variant-${index}`}>{renderVariantCard(row)}</Box>)}
            
            <Dialog 
                open={deleteConfirm.open} 
                onClose={() => setDeleteConfirm({open: false, variant: null})}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        p: 2,
                        m: { xs: 2, sm: 3 }
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontFamily: 'Inter', 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#45464E',
                    pb: 1
                }}>
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent sx={{ py: 2 }}>
                    <DialogContentText sx={{ 
                        fontFamily: 'Inter', 
                        fontSize: '14px', 
                        color: '#8B8D97',
                        lineHeight: 1.5
                    }}>
                        ¿Estás seguro de que deseas eliminar esta variante? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pt: 2, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button 
                        onClick={() => setDeleteConfirm({open: false, variant: null})} 
                        variant="outlined"
                        sx={{
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            borderColor: '#E1E2E9',
                            color: '#6E7079',
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                                borderColor: '#C1C2C9',
                                backgroundColor: '#F8F9FA'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        variant="contained"
                        sx={{
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#DC3545',
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                                backgroundColor: '#C82333'
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

const style = {
    hideScroll: {
        overflowY: "scroll",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
        },
    }
}