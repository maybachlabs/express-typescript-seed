import * as express from "express";
import {User} from "../models";
import {UserManager} from "../managers/UserManager";
import {Auth} from "../auth/auth";
import {UserDTO} from "../models/dtos/UserDTO";
import {Roles} from "../auth/roles";
import * as multer from 'multer';
import {BaseRouter} from "./BaseRouter";

export class UserRouter extends BaseRouter {

    private userManager: UserManager;
    private uploadHandler: any;

    constructor() {
        super();
        this.userManager = new UserManager();
        this.uploadHandler = multer({ storage: multer.memoryStorage() }); // configure multer to use memory storage
        this.buildRoutes();
    }

    public async get(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            if (req.query.email) {
                const user = await this.userManager.findByEmail(req.query.email);
                res.json(new UserDTO(user));
            } else {
                const users = await User.findAll<User>();
                const userDTOs = users.map(user => {
                    return new UserDTO(user);
                });
                res.json(userDTOs);
            }
        } catch (error) {
            next(error);
        }
    }

    public async post(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.userManager.createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.role, req.body.profilePicUrl);
            res.json(new UserDTO(user));
        } catch (error) {
            next(error);
        }
    }

    public async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.userManager.updateUser(req.params.id, req.body.email, req.body.firstName, req.body.lastName, req.body.role, req.body.profilePicUrl);
            res.json(new UserDTO(user));
        } catch (error) {
            next(error);
        }
    }

    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.userManager.deleteUser(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    public async getByToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.json(new UserDTO(req.user));
        } catch (error) {
            next(error);
        }
    }

    public async changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.userManager.updatePassword(req.params.id, req.body.currentPassword, req.body.newPassword);
            res.json(new UserDTO(user));
        } catch (error) {
            next(error);
        }
    }

    public async uploadProfileImage(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.userManager.updateProfileImage(req.params.id, req.file);
            res.json(new UserDTO(user));
        } catch (error) {
            next(error);
        }
    }

    private buildRoutes() {
        this.router.get("/", Auth.getBearerMiddleware(), Roles.connectRoles.can('modify user'), this.get.bind(this));
        this.router.post("/", this.post.bind(this));
        this.router.delete("/:id", Auth.getBearerMiddleware(), Roles.connectRoles.can('modify user'), this.delete.bind(this));
        this.router.put("/:id", Auth.getBearerMiddleware(), Roles.connectRoles.can('modify user'), this.put.bind(this));
        this.router.get("/current", Auth.getBearerMiddleware(), this.getByToken.bind(this));
        this.router.put("/:id/password",  Auth.getBearerMiddleware(), Roles.connectRoles.can('modify user'), this.changePassword.bind(this));
        this.router.put("/:id/profileImage",  Auth.getBearerMiddleware(), Roles.connectRoles.can('modify user'), this.uploadHandler.single('profileImage'), this.uploadProfileImage.bind(this));
    }
}