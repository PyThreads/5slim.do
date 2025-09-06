import axiosInstance from "../../../../context/adminAxiosInstance";

export const carouselStoreService = {
    getAllCarousels: async (filters: any) => {
        try {
            const response = await axiosInstance.get('/carouselStore', {
                params: filters
            });
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al obtener slides';
          
            throw error;
        }
    },

    createCarousel: async (carouselData: any) => {
        try {
            const response = await axiosInstance.post('/carouselStore', carouselData);
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al crear slide';
            throw error;
        }
    },

    updateCarousel: async (carouselId: string, carouselData: any) => {
        try {
            const response = await axiosInstance.put(`/carouselStore/${carouselId}`, carouselData);
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al actualizar slide';
            throw error;
        }
    },

    deleteCarousel: async (carouselId: string) => {
        try {
            const response = await axiosInstance.delete(`/carouselStore/${carouselId}`);
            return response.data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Error al eliminar slide';
            throw error;
        }
    }
};