import {Server} from "../server";
import request = require("supertest");
import {UserManager} from "../managers/UserManager";
import {RoleEnum} from "../models/enums/RoleEnum";
import {User} from "../models";

export class TestHelper {

    static async initializeTestSuite() {
        try {
            return await Server.initializeApp();
        } catch (error) {
            throw error;
        }
    }

    static async getAuthToken(role: RoleEnum, email?: string): Promise<string> {
        try {
            let userName;
            if(email) {
                userName = email;
            } else {
                userName = await TestHelper.getEmailForRole(role);
            }
            console.log('USERNAME: ', userName);
            const response = await request(Server.app)
                .post('/oauth/token')
                .send({
                    'username': userName,
                    'password': 'password',
                    'grant_type': 'password'
                })
                .set('Accept', 'application/json');

            expect(response.body).toEqual(expect.objectContaining({
                access_token: expect.any(String)
            }));
            return response.body.access_token;
        } catch (error) {
            throw error;
        }
    }

    static async createMember(email?: string): Promise<User> {
        const userManager = new UserManager();
        return userManager.createUser(email || 'test.member@gmail.com', 'password', 'Test', 'Member',  RoleEnum.MEMBER);
    }

    static async createAdmin(): Promise<User> {
        const userManager = new UserManager();
        return userManager.createUser('test.admin@gmail.com', 'password', 'Test', 'Admin', RoleEnum.ADMIN);
    }

    private static async getEmailForRole(role: RoleEnum): Promise<string> {
        switch(role) {
            case RoleEnum.ADMIN:
                return 'test.admin@gmail.com';
            case RoleEnum.MEMBER:
                return 'test.member@gmail.com';
        }
    }
}