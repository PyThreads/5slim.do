import axiosInstance from "../../../../context/adminAxiosInstance";

export const userManagementService = {
    getAllUsers: async (filters: any) => {
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: filters
            });
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al obtener usuarios';
          
            throw error;
        }
    },

    createUser: async (userData: any) => {
        try {
            const response = await axiosInstance.post('/admin/users', userData);
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al crear usuario';
            throw error;
        }
    },

    updateUser: async (userId: string, userData: any) => {
        try {
            const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al actualizar usuario';
            throw error;
        }
    }
};