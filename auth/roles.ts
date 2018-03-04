import {AuthError} from "../errors/AuthError";
import {RoleEnum} from "../models/enums/RoleEnum";

const ConnectRoles = require('connect-roles');

export class Roles {

    public static connectRoles;

    public static middleware() {
        return Roles.connectRoles.middleware();
    }

    public static is(role: RoleEnum) {
        return Roles.connectRoles.is(role.toString());
    }

    public static buildRoles() {

        Roles.connectRoles = new ConnectRoles({
            failureHandler: function (req, res, action) {
                const error = new AuthError('Access Denied - You don\'t have permission to: ' + action);
                res.status(403).json(error);
            },
            async: true
        });

        Roles.connectRoles.use(RoleEnum.ADMIN, function (req) {
            if (req.user.role === 'admin') {
                return true;
            }
        });

        Roles.connectRoles.use('modify user', function (req) {
            if(Roles.isAdmin(req.user)) {
                return true;
            } else {
                return req.user.id === req.params.id || req.user.email === req.query.email;
            }
        });
    }

    private static isAdmin(user): boolean {
        return user.role === 'admin';
    }
}