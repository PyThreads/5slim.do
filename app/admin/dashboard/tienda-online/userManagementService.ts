import axiosInstance from "../../../../context/adminAxiosInstance";
import { notify } from "../../../utils/EventBus";

export const userManagementService = {
    getAllUsers: async (filters: any) => {
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: filters
            });
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al obtener usuarios';
            notify.error('Error', message);
            throw error;
        }
    },

    createUser: async (userData: any) => {
        try {
            const response = await axiosInstance.post('/admin/users', userData);
            notify.success('Éxito', 'Usuario creado exitosamente');
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al crear usuario';
            notify.error('Error', message);
            throw error;
        }
    },

    updateUser: async (userId: string, userData: any) => {
        try {
            const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
            notify.success('Éxito', 'Usuario actualizado exitosamente');
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al actualizar usuario';
            notify.error('Error', message);
            throw error;
        }
    }
};