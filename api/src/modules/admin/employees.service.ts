import { Db } from 'mongodb';
import { COLLNAMES, IAdmin, IPaginationResult, IUserType } from '../../interfaces';
import BaseService from '../../base/baseService';

export class EmployeesService extends BaseService {


    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: COLLNAMES.ADMIN });
    }

    async getAllEmployees(filters: any, ownerId: number): Promise<IPaginationResult> {
        try {

            const match: any = {
                userType: IUserType.EMPLEADO,
                ownerId: ownerId
            }

            const query: any = [
                {
                    $match: match
                }
            ];

            if (filters.fullName) {
                query["fullName"] = { $regex: this.diacriticSensitive(filters.fullName), $options: "i" }
            };
            const result = this.paginate({
                query,
                page: filters.page,
                limit: filters.limit,
                collection: COLLNAMES.ADMIN,
                sort: { _id: -1 }
            })

            return result;

        } catch (error) {
            throw new Error(`Error fetching employees: ${error}`);
        }
    }

    async createEmployee(employeeData: IAdmin, user: IAdmin): Promise<IAdmin> {
        try {

            const exists = await this.collection.countDocuments({ email: { $regex: this.diacriticSensitive(employeeData.email), $options: "i" } });

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + employeeData.email);
            }

            const newEmployee: IAdmin = {
                ...employeeData,
                fullName: `${employeeData.firstName.trim()} ${employeeData.lastName.trim()}`.trim(),
                userType: IUserType.EMPLEADO
            };

            try {
                await this.insertOne({ body: newEmployee, user: user });
                return newEmployee;
            } catch (error) {
                throw new Error("Ha ocurrido un error al guardar el empleado.")
            }

        } catch (error) {
            throw error
        }
    }

    async updateEmployee(_id: number, employeeData: Partial<IAdmin>, ownerId: number): Promise<IAdmin | null> {
        try {

            const exists: IAdmin = await this.collection.findOne({ _id: _id });

            if (exists.email !== employeeData.email) {
                const usedByOtherUser = await this.collection.findOne({ email: employeeData.email })
                if (usedByOtherUser) {
                    throw new Error("Existe una cuenta con el correo: " + employeeData.email);
                }
            }

            if (employeeData.firstName || employeeData.lastName) {
                const currentEmployee = await this.collection.findOne({ _id: _id, ownerId });
                if (currentEmployee) {
                    employeeData.fullName = `${employeeData.firstName || currentEmployee.firstName} ${employeeData.lastName || currentEmployee.lastName}`.trim();
                }
            }

            try {
                const result = await this.collection.findOneAndUpdate(
                    { _id: _id, userType: IUserType.EMPLEADO, ownerId },
                    { $set: employeeData },
                    { returnDocument: 'after' }
                );

                return result.value;
            } catch (error) {
                throw new Error("Ha ocurrido un error al actualizar.")
            }
            
        } catch (error) {
            throw error;
        }
    }

    async deleteEmployee(_id: number, ownerId: number): Promise<boolean> {
        try {
            const result = await this.collection.deleteOne({
                _id: _id,
                userType: IUserType.EMPLEADO,
                ownerId
            });

            return result.deletedCount > 0;
        } catch (error) {
            throw new Error(`Error deleting employee: ${error}`);
        }
    }

}