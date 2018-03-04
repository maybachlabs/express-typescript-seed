import {User} from "../models/entities/User";
import {AccessToken} from "../models/entities/AccessToken";
import {NotFoundError} from "../errors/NotFoundError";

export class AuthManager {

    constructor() {
    }

    public async getUserByToken(token: string): Promise<any> {
        const storedToken = await AccessToken.find<AccessToken>({where: {token: token}, include: [User]});
        if (storedToken && storedToken.user) {
            return storedToken.user;
        } else {
            throw new NotFoundError("No user found with provided token");
        }
    }

    public async getAccessTokenForUser(userId: string): Promise<any> {
        const accessToken = await AccessToken.findOne({where: {userId: userId}});
        if(accessToken) {
            return accessToken;
        } else {
            throw new NotFoundError("No access token found for the provided user");
        }
    }

    public async logout(user: User): Promise<any> {
        const accessToken = await AccessToken.findOne({where: {userId: user.id}});
        if(accessToken) {
            return accessToken.destroy();
        } else {
            throw new NotFoundError("No access token found for the provided user");
        }
    }
}