import * as express from "express";

export class BaseRouter {

    public router: express.Router;

    constructor() {
        this.router = express.Router();
        const limiter = require('express-limiter')(this.router);
        limiter({
            lookup: 'user.id',
            // 150 requests per hour
            total: 150,
            expire: 1000 * 60 * 60
        });
    }
}