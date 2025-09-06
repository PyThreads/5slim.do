import axiosInstance from "../../../../context/adminAxiosInstance";
import { notify } from "../../../utils/EventBus";

export const carouselStoreService = {
    getAllCarousels: async (filters: any) => {
        try {
            const response = await axiosInstance.get('/carouselStore', {
                params: filters
            });
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al obtener slides';
            notify.error('Error', message);
            throw error;
        }
    },

    createCarousel: async (carouselData: any) => {
        try {
            const response = await axiosInstance.post('/carouselStore', carouselData);
            notify.success('Éxito', 'Slide creado exitosamente');
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al crear slide';
            notify.error('Error', message);
            throw error;
        }
    },

    updateCarousel: async (carouselId: string, carouselData: any) => {
        try {
            const response = await axiosInstance.put(`/carouselStore/${carouselId}`, carouselData);
            notify.success('Éxito', 'Slide actualizado exitosamente');
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al actualizar slide';
            notify.error('Error', message);
            throw error;
        }
    },

    deleteCarousel: async (carouselId: string) => {
        try {
            const response = await axiosInstance.delete(`/carouselStore/${carouselId}`);
            notify.success('Éxito', 'Slide eliminado exitosamente');
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al eliminar slide';
            notify.error('Error', message);
            throw error;
        }
    }
};