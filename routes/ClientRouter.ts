import * as express from "express";
import {Client} from "../models";
import {Auth} from "../auth/auth";
import {ClientManager} from "../managers/ClientManager";

export class ClientRouter {

    public router: express.Router;
    private clientManager: ClientManager;

    constructor() {
        this.clientManager = new ClientManager();
        this.router = express.Router();
        this.buildRoutes();
    }

    public async get(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const clients = await Client.findAll<Client>();
            res.json(clients);
        } catch(error) {
            next(error);
        }
    }

    public async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const client = await Client.findOne<Client>({ where: {clientId: req.params.id} });
            res.json(client);
        } catch(error) {
            next(error);
        }
    }

    public async post(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const newClient = await this.clientManager.createClient(req.body.clientId, req.body.clientSecret);
            res.json(newClient);
        } catch(error) {
            next(error);
        }
    }

    public async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const updatedClient = await this.clientManager.updateClient(req.body.clientId, req.body.clientSecret);
            res.json(updatedClient);
        } catch(error) {
            next(error);
        }
    }

    public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const client = this.clientManager.deleteClient(req.body.clientId);
            res.json(client);
        } catch(error) {
            next(error);
        }
    }

    private buildRoutes() {
        this.router.get("/", Auth.getBearerMiddleware(), this.get.bind(this));
        this.router.get("/:id", Auth.getBearerMiddleware(), this.getById.bind(this));
        this.router.post("/", Auth.getBearerMiddleware(), this.post.bind(this));
        this.router.put("/:id", Auth.getBearerMiddleware(), this.put.bind(this));
        this.router.delete("/:id", Auth.getBearerMiddleware(), this.delete.bind(this));
    }

}