import express from "express"
import { Db } from "mongodb"

import UserRouter  from "./modules/users/users.routes"
import AdminRouter from "./modules/admin/admin.routes"

const router = express.Router()

class RouterApp{

    public readonly routes: typeof router;

    constructor({mongoDatabase}: {mongoDatabase: Db}){

        router.use("/users",new UserRouter({mongoDatabase}).routes);
        router.use("/admin",new AdminRouter({mongoDatabase}).routes);
        this.routes = router
    }

}

export default RouterApp