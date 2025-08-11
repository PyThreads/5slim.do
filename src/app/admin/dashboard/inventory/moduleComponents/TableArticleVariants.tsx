import * as React from 'react';
import { Box, Grid, Paper, MenuItem, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CustomField, { DefaultSwitch } from '../../../../../../components/inputs/CustomField';
import { v4 as uuidv4 } from 'uuid';
import { IArticleImages, IArticleStatus, IArticlesVariants, IArticleAvailability } from '../../../../../../api/src/interfaces';
import { baseService } from '../../../../utils/baseService';
import axios from '../../../../../../context/adminAxiosInstance';
import { eventBus } from '../../../../utils/broadcaster';
import Image from 'next/image';

export default function TableArticleVariants({
    rows = [],
    onChange,
    mainImage,
}: {
    rows: IArticlesVariants[];
    onChange: Function;
    mainImage: string | undefined;
}) {
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
    }));

    const handleChangeNewOne = (value: any, name: any, row?: IArticlesVariants | null | undefined) => {
        const result = name === 'stock' && (value === '' || value < 0) ? 0 : value;

        if (row) {
            const updatedRow: IArticlesVariants = { ...row, [name]: result };
            const arr = [...rows];
            const index = arr.findIndex((item) => item._id === updatedRow._id);
            if (index !== -1) {
                arr[index] = updatedRow;
                onChange([...arr]);
            }
            return;
        }

        setNewOne((prev) => ({ ...prev, [name]: result }));
    };

    const addSelected = () => {
        const arr = [...rows];
        for (let i = 1; i <= newOne.stock!; i++) {
            const variant: IArticlesVariants = {
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
            };
            arr.push(variant);
        }
        onChange(arr);
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
            tracking: ''
        });
    };

    const removeSelected = (row: IArticlesVariants) => {
        const arr = rows.filter((item) => item._id !== row._id);
        onChange([...arr]);
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
                const arr = [...rows];
                const index = arr.findIndex((value) => item._id === value._id);
                if (index !== -1) {
                    const currentImages = arr[index].images || [];
                    const cleanedImages = currentImages.map((img) => ({ ...img, primary: false }));
                    const list = [...cleanedImages, ...result];
                    arr[index] = { ...arr[index], images: list };
                    onChange([...arr]);
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
            <Paper sx={{ p: 2, mb: 2, ...style.hideScroll }} elevation={2} >
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
                                    label="Comentario"
                                    fullWidth
                                    noValidate
                                    type="text"
                                    name="comment"
                                    value={variant.comment || ""}
                                    onChange={(e: any) =>
                                        handleChangeNewOne(e.target.value || '', 'comment', isNew ? undefined : variant)
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
                            <Grid item xs={12} textAlign="right">
                                {isNew ? (
                                    <IconButton onClick={addSelected}>
                                        <AddCircleIcon sx={{ color: '#A3A3A3' }} />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={() => removeSelected(variant)}>
                                        <DoNotDisturbOnIcon sx={{ color: '#A3A3A3' }} />
                                    </IconButton>
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
            {rows.map((row) => <Box key={row._id}>{renderVariantCard(row)}</Box>)}
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