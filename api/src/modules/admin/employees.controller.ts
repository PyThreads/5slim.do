import { Request, Response } from 'express';
import { EmployeesService } from './employees.service';
import { IAdmin, IPaginateClients, IUserType } from '../../interfaces';
import { Db } from 'mongodb';

export class EmployeesController {
    private employeesService: EmployeesService;

    constructor({mongoDatabase}:{mongoDatabase: Db}) {
        this.employeesService = new EmployeesService({mongoDatabase});
    }

    getAllEmployees = async (req: Request & { admin?: IAdmin }, res: Response) => {
        try {
            const filters = req.query as unknown as IPaginateClients;
            const admin: IAdmin = res.locals.admin;
            const result = await this.employeesService.getAllEmployees(filters, admin.ownerId);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(510).json({
                success: false,
                message: error.message
            });
        }
    };

    createEmployee = async (req: Request & { admin?: IAdmin }, res: Response) => {
        try {
            const employeeData: IAdmin = req.body;
            const admin: IAdmin = res.locals.admin;
            employeeData.userType = IUserType.EMPLEADO;
            employeeData.ownerId = admin.ownerId;
            const result = await this.employeesService.createEmployee(employeeData,admin);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(510).json({
                success: false,
                message: error.message
            });
        }
    };

    updateEmployee = async (req: Request & { admin?: IAdmin }, res: Response) => {
        try {
            const { id } = req.params;
            const employeeData: Partial<IAdmin> = req.body;
            const admin: IAdmin = res.locals.admin;
            const result = await this.employeesService.updateEmployee(parseInt(id), employeeData, admin.ownerId);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(510).json({
                success: false,
                message: error.message
            });
        }
    };

    deleteEmployee = async (req: Request & { admin?: IAdmin }, res: Response) => {
        try {
            const { id } = req.params;
            const admin: IAdmin = res.locals.admin;
            const result = await this.employeesService.deleteEmployee(parseInt(id), admin.ownerId);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(510).json({
                success: false,
                message: error.message
            });
        }
    };
}