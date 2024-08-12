import express from "express"
import { Users } from "./users.controller"
import {
    registerUser,
    validateLogin,
    forgotPasswordValidation,
    submitPassword,
    addAddressValidation,
    changePasswordValidation,
    updatePersonalInfoValidation
} from "./users.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();
const publicRouter = express.Router();


class UserRouter {

    public readonly routes: typeof router
    private readonly usersController: Users
    private readonly baseService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.usersController = new Users({ mongoDatabase });
        this.baseService = new BaseService({ mongoDatabase, tableName: "USERS" })

        //PUBLIC ROUTES
        publicRouter.post("/login", validateLogin(), this.usersController.login.bind(this.usersController))
        publicRouter.post("/register", registerUser(), this.usersController.register.bind(this.usersController))
        publicRouter.post("/submitPassword", submitPassword(), this.usersController.submitPassword.bind(this.usersController))
        publicRouter.post("/forgotPassword", forgotPasswordValidation(), this.usersController.sendEmailCode.bind(this.usersController))


        router.get("/address", this.usersController.getAddress.bind(this.usersController))
        router.put("/address", addAddressValidation(), this.usersController.addAddress.bind(this.usersController))
        router.put("/personalInformation", updatePersonalInfoValidation(), this.usersController.personalInformation.bind(this.usersController))
        router.put("/changePassword", changePasswordValidation(), this.usersController.changePassword.bind(this.usersController))
        router.get("/me", this.usersController.me.bind(this.usersController))

        router.use("/private", this.baseService.verifyToken.bind(this.baseService))
        router.use("/private", router);


        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default UserRouter