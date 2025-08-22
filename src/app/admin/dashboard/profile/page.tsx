"use client"
import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Grid, Typography, CircularProgress } from "@mui/material"
import { Inter } from "next/font/google"
import CustomField from "../../../../../components/inputs/CustomField";
import { useAdminAuth } from "../../../../../context/AdminContext";
import { IAdmin } from "../../../../../api/src/interfaces";
import Image from "next/image";
import { UploadImageIcon } from "../../../../../components/icons/Svg";
import axios from "../../../../../context/adminAxiosInstance";
import { eventBus } from "../../../utils/broadcaster";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function ProfilePage() {
    const { currentAdmin, setCurrentAdmin, refreshAdmin } = useAdminAuth() as { currentAdmin: IAdmin | null, setCurrentAdmin: (admin: IAdmin) => void, refreshAdmin: () => Promise<void> };
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const refInput = useRef<HTMLInputElement>(null);
    const refLogoInput = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profilePicture: "",
        logo: ""
    });

    // Update form data when currentAdmin changes
    useEffect(() => {
        if (currentAdmin) {
            // Handle both possible field names
            const firstName = currentAdmin.firstName ||  "";
            const lastName = currentAdmin.lastName || "";
            
            setFormData({
                firstName: firstName,
                lastName: lastName,
                email: currentAdmin.email || "",
                profilePicture: currentAdmin.profilePicture || "",
                logo: currentAdmin.logo || ""
            });
        }
    }, [currentAdmin]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            setUploadingImage(true);
            const formDataUpload = new FormData();
            formDataUpload.append('0', file[0]);

            const { data } = await axios.post('/admin/private/images/upload', formDataUpload);
            const imageUrl = data.data[0]?.url;
            
            if (imageUrl) {
                setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
                // Update current admin in context immediately
                if (currentAdmin) {
                    setCurrentAdmin({ ...currentAdmin, profilePicture: imageUrl });
                }
                
                // Auto-save profile after image upload
                const updatedFormData = { ...formData, profilePicture: imageUrl };
                await axios.put('/admin/private/profile', updatedFormData);
                await refreshAdmin();
                
                eventBus.emit('notify', {
                    message: 'Imagen subida y guardada exitosamente.',
                    open: true,
                    type: 'success',
                    title: 'Éxito!'
                });
            }
        } catch (error) {
            eventBus.emit('notify', {
                message: 'Error al subir la imagen.',
                open: true,
                type: 'error',
                title: 'Error!'
            });
        } finally {
            setUploadingImage(false);
            if (refInput.current) refInput.current.value = '';
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            setUploadingLogo(true);
            const formDataUpload = new FormData();
            formDataUpload.append('0', file[0]);

            const { data } = await axios.post('/admin/private/images/upload', formDataUpload);
            const logoUrl = data.data[0]?.url;
            
            if (logoUrl) {
                setFormData(prev => ({ ...prev, logo: logoUrl }));
                // Update current admin in context immediately
                // Auto-save profile after logo upload
                const updatedFormData = { ...formData, logo: logoUrl };
                await axios.put('/admin/private/profile', updatedFormData);
                await refreshAdmin();
                
                // Update current admin in context after refresh
                if (currentAdmin) {
                    setCurrentAdmin({ ...currentAdmin, logo: logoUrl });
                }
                
                eventBus.emit('notify', {
                    message: 'Logo subido y guardado exitosamente.',
                    open: true,
                    type: 'success',
                    title: 'Éxito!'
                });
            }
        } catch (error) {
            eventBus.emit('notify', {
                message: 'Error al subir el logo.',
                open: true,
                type: 'error',
                title: 'Error!'
            });
        } finally {
            setUploadingLogo(false);
            if (refLogoInput.current) refLogoInput.current.value = '';
        }
    };

    const canManageLogo = currentAdmin?.userType === 'Cliente' || currentAdmin?._id === currentAdmin?.ownerId;

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            const { data } = await axios.put('/admin/private/profile', formData);
            
            // Refresh admin data from server to get latest info
            await refreshAdmin();
            
            eventBus.emit('notify', {
                message: 'Perfil actualizado exitosamente.',
                open: true,
                type: 'success',
                title: 'Guardado!'
            });
        } catch (error) {
            eventBus.emit('notify', {
                message: 'Error al actualizar el perfil.',
                open: true,
                type: 'error',
                title: 'Error!'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography sx={style.title}>Mi Perfil</Typography>

            <Box mt="23px" padding="22px 21px" bgcolor="#FFFFFF" borderRadius="12px">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box
                                component="label"
                                htmlFor="profile-image-upload"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    bgcolor: "#F4F5FA",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "2px dashed #5570F1",
                                    "&:hover": {
                                        bgcolor: "#F8F9FF"
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={refInput}
                                />
                                {formData.profilePicture ? (
                                    <Image
                                        fill
                                        src={formData.profilePicture}
                                        alt="Profile"
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        {uploadingImage ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <>
                                                <UploadImageIcon filled={false} />
                                                <Typography fontSize="12px" color="#5570F1" mt={1}>
                                                    Subir foto
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                )}
                            </Box>
                            <Typography fontSize="14px" color="#8B8D97" mt={2} textAlign="center">
                                Haz clic para cambiar tu foto de perfil
                            </Typography>
                        </Box>
                        
                        {canManageLogo && (
                            <Box mt={3}>
                                <Typography fontSize="16px" fontWeight={600} color="#45464E" mb={2} textAlign="center">
                                    Logo del Negocio
                                </Typography>
                                <Box
                                    component="label"
                                    htmlFor="logo-upload"
                                    sx={{
                                        width: 120,
                                        height: 80,
                                        borderRadius: "8px",
                                        bgcolor: "#F4F5FA",
                                        position: "relative",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        border: "2px dashed #5570F1",
                                        "&:hover": {
                                            bgcolor: "#F8F9FF"
                                        },
                                        mx: "auto"
                                    }}
                                >
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        id="logo-upload"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        ref={refLogoInput}
                                    />
                                    {formData.logo ? (
                                        <Image
                                            fill
                                            src={formData.logo}
                                            alt="Logo"
                                            style={{ objectFit: "contain" }}
                                        />
                                    ) : (
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            {uploadingLogo ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <>
                                                    <UploadImageIcon filled={false} />
                                                    <Typography fontSize="12px" color="#5570F1" mt={1}>
                                                        Subir logo
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                                <Typography fontSize="12px" color="#8B8D97" mt={1} textAlign="center">
                                    Logo para sidebar y facturas
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <CustomField
                                    label="Nombre"
                                    fullWidth
                                    size="small"
                                    value={formData.firstName}
                                    onChange={(e: any) => handleInputChange('firstName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomField
                                    label="Apellido"
                                    fullWidth
                                    size="small"
                                    value={formData.lastName}
                                    onChange={(e: any) => handleInputChange('lastName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomField
                                    label="Email"
                                    fullWidth
                                    size="small"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e: any) => handleInputChange('email', e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={style.saveButton}
                                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

const style = {
    title: {
        fontFamily: inter.style.fontFamily,
        fontSize: { xs: 13, sm: 16, md: 16 },
        color: "#45464E",
    },
    saveButton: {
        backgroundColor: "#5570F1",
        fontSize: 14,
        fontFamily: inter.style.fontFamily,
        height: 36,
        textTransform: "none",
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "#5570F1",
        }
    }
}