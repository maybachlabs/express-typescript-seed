import * as express from "express";
import {ClientRouter} from "./ClientRouter";
import {AuthRouter} from "./AuthRouter";
import {UserRouter} from "./UserRouter";

export class Router {

    public static initializeRoutes(app: express.Express) {
        app.use('/clients', new ClientRouter().router);
        app.use('/oauth', new AuthRouter().router);
        app.use('/users', new UserRouter().router);
    }
}
