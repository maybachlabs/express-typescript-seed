import * as express from "express";
import { Oauth2 } from "../auth/oauth2";
import * as passport from "passport";
import {AuthManager} from "../managers/AuthManager";
import {Auth} from "../auth/auth";
import {BaseRouter} from "./BaseRouter";

export class AuthRouter extends BaseRouter {

    private authManager: AuthManager;

    constructor() {
        super();
        this.authManager = new AuthManager();
        this.buildRoutes();
    }

    public async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.authManager.logout(req.user);
            res.json(user);
        } catch(error) {
            next(error);
        }
    }

    private buildRoutes() {
        const oath = new Oauth2();
        this.router.post("/token", oath.getTokenEndpoint());
        this.router.post('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
            res.json({token: req.user.token});
        });
        this.router.post("/logout", Auth.getBearerMiddleware(),  this.logout.bind(this));
    }



}