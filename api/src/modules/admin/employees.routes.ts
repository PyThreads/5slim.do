import { Router } from 'express';
import { EmployeesController } from './employees.controller';
import { employeeValidations } from './employees.validationSchema';
import { Db } from 'mongodb';

export default function createEmployeesRoutes({mongoDatabase}:{mongoDatabase: Db}) {
    const router = Router();
    const employeesController = new EmployeesController({mongoDatabase});

    router.get('/employees', employeeValidations.getAllEmployees(), employeesController.getAllEmployees);
    router.post('/employees', employeeValidations.createEmployee(), employeesController.createEmployee);
    router.put('/employees/:id', employeeValidations.updateEmployee(), employeesController.updateEmployee);
    router.delete('/employees/:id', employeeValidations.deleteEmployee(), employeesController.deleteEmployee);

    return router;
}