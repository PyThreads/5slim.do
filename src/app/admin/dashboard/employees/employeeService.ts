import axiosInstance from "../../../../../context/adminAxiosInstance";
import { IAdmin, IPaginationResult } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../utils/broadcaster";

export const employeeService = {
    getAllEmployees: async (filters: any): Promise<IPaginationResult> => {
        try {
            const { data } = await axiosInstance.get('/admin/private/employees', {
                params: filters
            });
            return data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al cargar los empleados.";
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" });
            const fakeReturn: IPaginationResult = {
                list: [],
                totalItems: 0,
                totalPages: 0,
                currentPage: 1
            }
            return fakeReturn
        }
    },

    createEmployee: async (employeeData: Partial<IAdmin>) => {
        try {
            const { data } = await axiosInstance.post('/admin/private/employees', {
                ...employeeData
            });
            return data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al cargar los empleados.";
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" });
            throw error;
        }
    },

    updateEmployee: async (_id: number, employeeData: Partial<IAdmin>) => {
        try {
            const { data } = await axiosInstance.put(`/admin/private/employees/${_id}`, employeeData);
            return data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al cargar los empleados.";
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" });
            throw error;
        }
    },

    deleteEmployee: async (_id: number) => {
        try {
            const { data } = await axiosInstance.delete(`/admin/private/employees/${_id}`);
            return data.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Ha ocurrido un error al cargar los empleados.";
            eventBus.emit("notify", { message: message, open: true, type: "error", title: "Upss!" });
            throw error;
        }
    }
};