import express from "express"
import { Users } from "./users.controller"
import {
    registerUser,
    validateLogin,
    sentCodeMail,
    submitPassword,
    addAddressValidation,
    changePasswordValidation,
    updatePersonalInfoValidation,
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
        publicRouter.post("/getTempLoginCode", sentCodeMail(), this.usersController.sendEmailCode.bind(this.usersController))


        router.get("/me", this.usersController.me.bind(this.usersController))

        router.use("/private", this.baseService.verifyToken.bind(this.baseService))
        router.use("/private", router);


        router.use("/public", publicRouter);

        this.routes = router;
    }
}


export default UserRouter