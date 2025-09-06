"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import { CustomField } from '../../../../../components/inputs/CustomField';
import { Inter } from 'next/font/google';
import { carouselStoreService } from '../carouselStoreService';
import { eventBus } from '../../../../utils/broadcaster';
import Image from 'next/image';
import { UploadImageIcon, TrashIcon, DownloadCloudIcon } from '../../../../../components/icons/Svg';
import axios from '../../../../../context/adminAxiosInstance';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface CarouselFormProps {
    valuesToEdit?: any;
    onClose: () => void;
}

export default function CarouselForm({ valuesToEdit = {}, onClose }: CarouselFormProps) {
    const [formData, setFormData] = useState({
        image: '',
        title: '',
        price: 0,
        originalPrice: 0,
        description: '',
        buttonText: '',
        buttonLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<any>(null);
    const refInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (valuesToEdit._id) {
            setFormData({
                image: valuesToEdit.image || '',
                title: valuesToEdit.title || '',
                price: valuesToEdit.price || 0,
                originalPrice: valuesToEdit.originalPrice || 0,
                description: valuesToEdit.description || '',
                buttonText: valuesToEdit.buttonText || '',
                buttonLink: valuesToEdit.buttonLink || '',
            });
            if (valuesToEdit.image) {
                setUploadedImage({ url: valuesToEdit.image, id: 'existing' });
            }
        }
    }, [valuesToEdit]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            const formData = new FormData();
            formData.append('0', file[0]);

            const { data }: { data: any } = await axios.post("/admin/private/images/upload", formData);
            const result = data.data[0];
            
            setUploadedImage(result);
            setFormData(prev => ({ ...prev, image: result.url }));
        } catch (error) {
            eventBus.emit("notify", { 
                message: "Ha ocurrido un error al subir la imagen.", 
                open: true, 
                type: "error", 
                title: "Error" 
            });
        } finally {
            if (refInput.current) {
                refInput.current.value = "";
            }
        }
    };

    const handleDeleteImage = async () => {
        try {
            if (uploadedImage?.id && uploadedImage.id !== 'existing') {
                await axios.delete(`/admin/private/images/delete/${uploadedImage.id}`);
            }
            setUploadedImage(null);
            setFormData(prev => ({ ...prev, image: '' }));
        } catch (error) {
            eventBus.emit("notify", { 
                message: "Ha ocurrido un error al eliminar la imagen.", 
                open: true, 
                type: "error", 
                title: "Error" 
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            if (valuesToEdit._id) {
                await carouselStoreService.updateCarousel(valuesToEdit._id, formData);
            } else {
                await carouselStoreService.createCarousel(formData);
            }
            
            onClose();
        } catch (error: any) {
            eventBus.emit('notify', { 
                message: error?.response?.data?.message || error?.message || 'Error desconocido', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography fontFamily={inter.style.fontFamily} fontSize={16} color={"#8B8D97"} marginTop={"28px"}>
                        Información del Slide
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography fontFamily={inter.style.fontFamily} fontSize={14} color={"#8B8D97"} mb={1}>
                        Imagen del Slide (Rectangular)
                    </Typography>
                    
                    <input
                        type="file"
                        style={{ display: "none" }}
                        id="upload-carousel-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={refInput}
                    />
                    
                    <Box 
                        width="100%" 
                        height={200} 
                        bgcolor="#F4F5FA" 
                        borderRadius="12px" 
                        border="1px solid #E1E2E9" 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center"
                        position="relative"
                        mb={2}
                    >
                        {uploadedImage ? (
                            <Box width="100%" height="100%" position="relative">
                                <Box position="absolute" top={8} right={8} display="flex" zIndex={1} gap={1}>
                                    <Box 
                                        sx={{ cursor: "pointer" }}
                                        component="label"
                                        htmlFor="upload-carousel-image"
                                    >
                                        <DownloadCloudIcon />
                                    </Box>
                                    <Box 
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleDeleteImage}
                                    >
                                        <TrashIcon />
                                    </Box>
                                </Box>
                                <Image
                                    src={uploadedImage.url}
                                    alt="Carousel slide"
                                    fill
                                    style={{ objectFit: 'cover', borderRadius: '12px' }}
                                />
                            </Box>
                        ) : (
                            <Box 
                                textAlign="center"
                                component="label" 
                                htmlFor="upload-carousel-image"
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                                    <UploadImageIcon filled={false} />
                                    <Typography 
                                        fontFamily={inter.style.fontFamily} 
                                        fontSize={17} 
                                        color="#5570F1" 
                                        fontWeight={500} 
                                        ml={1}
                                    >
                                        Subir Imagen
                                    </Typography>
                                </Box>
                                <Typography 
                                    fontFamily={inter.style.fontFamily} 
                                    fontSize={14} 
                                    color="#8B8D97" 
                                    fontWeight={400}
                                    px={2}
                                >
                                    Sube una imagen rectangular para el carousel.
                                    <br />
                                    Formato <strong>jpeg, png</strong> Tamaño recomendado <strong>1200x400px</strong>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    
                    <CustomField 
                        name="image" 
                        placeholder="O ingresa URL de la imagen" 
                        fullWidth 
                        value={formData.image}
                        onChange={(e: any) => {
                            setFormData(prev => ({ ...prev, image: e.target.value }));
                            if (e.target.value && !uploadedImage) {
                                setUploadedImage({ url: e.target.value, id: 'manual' });
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <CustomField 
                        name="title" 
                        placeholder="Título del slide" 
                        fullWidth 
                        value={formData.title}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomField 
                        name="price" 
                        placeholder="Precio" 
                        fullWidth 
                        type="number"
                        value={formData.price}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomField 
                        name="originalPrice" 
                        placeholder="Precio original (opcional)" 
                        fullWidth 
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    />
                </Grid>

                <Grid item xs={12}>
                    <CustomField 
                        name="description" 
                        placeholder="Descripción" 
                        fullWidth 
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomField 
                        name="buttonText" 
                        placeholder="Texto del botón" 
                        fullWidth 
                        value={formData.buttonText}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CustomField 
                        name="buttonLink" 
                        placeholder="Enlace del botón" 
                        fullWidth 
                        value={formData.buttonLink}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    />
                </Grid>

                <Grid container item xs={12} spacing={2} mt={2}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            sx={{ ...style.saveButton, ...style.cancelButton }}
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={style.saveButton}
                            disabled={loading}
                        >
                            {loading && <CircularProgress size={"15px"} sx={{ color: "white", marginRight: "6px" }} />}
                            {loading ? 'Guardando' : (valuesToEdit._id ? 'Actualizar' : 'Crear')}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}

const style = {
    cancelButton: {
        color: "#5570F1",
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        border: "1px solid #5570F1",
        "&:hover": { backgroundColor: "#FFFFFF" }
    },
    saveButton: {
        backgroundColor: "#5570F1",
        fontSize: "16px",
        textTransform: "none",
        borderRadius: "12px",
        height: "51px",
        fontWeight: "300",
        fontFamily: inter.style.fontFamily,
        "&:hover": { backgroundColor: "#5570F1" }
    }
};