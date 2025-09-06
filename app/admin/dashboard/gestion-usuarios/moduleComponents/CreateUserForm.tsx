"use client"
import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { CustomField } from '../../../../../components/inputs/CustomField';
import { Inter } from 'next/font/google';
import { userManagementService } from '../userManagementService';
import { eventBus } from '../../../../utils/broadcaster';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
});

interface CreateUserFormProps {
    valuesToEdit?: any;
    onClose: () => void;
}

export default function CreateUserForm({ valuesToEdit = {}, onClose }: CreateUserFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userType: 'Cliente',
        profilePicture: '',
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (valuesToEdit._id) {
            setFormData({
                firstName: valuesToEdit.firstName || '',
                lastName: valuesToEdit.lastName || '',
                email: valuesToEdit.email || '',
                userType: 'Cliente',
                profilePicture: valuesToEdit.profilePicture || '',
                active: valuesToEdit.active !== false,
            });
        }
    }, [valuesToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            if (valuesToEdit._id) {
                await userManagementService.updateUser(valuesToEdit._id, formData);
            } else {
                await userManagementService.createUser(formData);
            }
            
            onClose();
        } catch (error: any) {
            eventBus.emit('notify', { message: error?.response?.data?.message || error?.message || 'Error desconocido', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container>
                <Typography fontFamily={inter.style.fontFamily} fontSize={16} color={"#8B8D97"} marginTop={"28px"}>Información del usuario</Typography>

                <Grid item xs={12} mt="28px">
                    <CustomField 
                        name="firstName" 
                        placeholder="Nombres" 
                        fullWidth 
                        value={formData.firstName}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <CustomField 
                        name="lastName" 
                        placeholder="Apellidos" 
                        fullWidth 
                        value={formData.lastName}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <CustomField 
                        name="email" 
                        placeholder="Correo electrónico" 
                        fullWidth 
                        value={formData.email}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <CustomField 
                        name="profilePicture" 
                        placeholder="URL Foto de Perfil (Opcional)" 
                        fullWidth 
                        value={formData.profilePicture}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                    />
                </Grid>

                <Grid item xs={12} mt="28px">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#5570F1',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#5570F1',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography fontFamily={ inter.style.fontFamily} fontSize={16} color="#8B8D97">
                                Usuario Activo
                            </Typography>
                        }
                    />
                </Grid>





                <Grid container item xs={12} spacing={2} mt="28px">
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
                            sx={{ ...style.saveButton }}
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
        fontSize: "20px",
        textTransform: "none",
        borderRadius: "12px",
        height: "51px",
        fontWeight: "300",
        fontFamily: inter.style.fontFamily,
        "&:hover": { backgroundColor: "#5570F1" }
    }
}