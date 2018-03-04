import {Server} from "../server";
import {TestHelper} from "./test-helper";
import {User} from "../models/entities/User";
import * as http from "http";

const request = require('supertest');
let testServer: http.Server;
let memberToken: string;
let adminToken: string;
let member: User;
let admin: User;

beforeAll(async () => {
    testServer = await TestHelper.initializeTestSuite();
    member = await TestHelper.createMember();
    admin = await TestHelper.createAdmin();
    adminToken = await TestHelper.getAuthToken(admin.role);
    memberToken = await TestHelper.getAuthToken(member.role);
});

describe('Get all users', () => {
    test('should respond with all users', async () => {
        console.log('ADMIN TOKEN: ', adminToken);
        const response = await request(Server.app)
            .get('/users')
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('should respond with 403', async function () {
        const response = await request(Server.app)
            .get('/users')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(403);
    });
});

describe('Get user by email', () => {
    test('should respond with a member when member requests itself', async () => {
        const response = await request(Server.app)
            .get(`/users?email=${member.email}`)
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: 'Test',
            lastName: 'Member',
            email: 'test.member@gmail.com',
            profilePicUrl: null
        }));
    });

    test('should respond with a member when admin requests member', async () => {
        const response = await request(Server.app)
            .get(`/users?email=${member.email}`)
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: 'Test',
            lastName: 'Member',
            email: 'test.member@gmail.com',
            profilePicUrl: null
        }));
    });

    test('should respond with a forbidden error when member requests admin', async () => {
        const response = await request(Server.app)
            .get(`/users?email=test.admin@gmail.com`)
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(403);
    });
});

describe('Create New User', () => {
    test('should respond with a newly created user', async () => {
        const newUser = {
            "firstName": "Stephanie",
            "lastName": "Tipper",
            "profilePicUrl": "",
            "email": "tipper@gmail.com",
            "password": "password",
            "role": "member"
        };
        const response = await request(Server.app)
            .post('/users')
            .type('json')
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json')
            .send(newUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: "Stephanie",
            lastName: "Tipper",
            profilePicUrl: "",
            email: "tipper@gmail.com"
        }));
    });

    test('should fail with email required', async () => {
        const newUser = {
            "firstName": "Stephanie",
            "lastName": "Tipper",
            "profilePicUrl": "",
            "password": "password",
            "role": "member"
        };
        const response = await request(Server.app)
            .post('/users')
            .type('json')
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json')
            .send(newUser);
        expect(response.statusCode).toBe(400);
    });
});

describe('Get Current User', () => {
    test('member should be able retrieve himself', async () => {
        const response = await request(Server.app)
            .get(`/users/current`)
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: 'Test',
            lastName: 'Member',
            email: 'test.member@gmail.com',
            profilePicUrl: null
        }));
    });
});

describe('Change Password', () => {
    test('member should be able to change his own password', async () => {
        const response = await request(Server.app)
            .put(`/users/${member.id}/password`)
            .type('json')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json')
            .send({currentPassword: 'password', newPassword: 'newPassword'});
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: 'Test',
            lastName: 'Member',
            email: 'test.member@gmail.com',
            profilePicUrl: null
        }));
    });

    test('member should be able to retrieve token with new password', async () => {
        const response = await request(Server.app)
            .post('/oauth/token')
            .send({
                'username': member.email,
                'password': 'newPassword',
                'grant_type': 'password'
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            access_token: expect.any(String)
        }));
    });

    test('member should not be able to change admin password', async () => {
        const response = await request(Server.app)
            .put(`/users/${admin.id}/password`)
            .type('json')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json')
            .send({currentPassword: 'password', newPassword: 'newPassword'});
        expect(response.statusCode).toBe(403);
    });
});

describe('Update User', () => {
    test('member should be able to update self', async () => {
        const response = await request(Server.app)
            .put(`/users/${member.id}`)
            .type('json')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json')
            .send({lastName: 'New Name'});
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: "Test",
            lastName: "New Name",
            profilePicUrl: null,
            email: "test.member@gmail.com"
        }));
    });

    test('member should not be able to update admin', async () => {
        const response = await request(Server.app)
            .put(`/users/${admin.id}`)
            .type('json')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json')
            .send({lastName: 'New Name'});
        expect(response.statusCode).toBe(403);
    });

    test('admin should be able to update member', async () => {
        const response = await request(Server.app)
            .put(`/users/${member.id}`)
            .type('json')
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json')
            .send({lastName: 'New New Name'});
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: "Test",
            lastName: "New New Name",
            profilePicUrl: null,
            email: "test.member@gmail.com"
        }));
    });
});

describe('Delete User', () => {

    test('member should not be able to delete admin', async () => {
        const response = await request(Server.app)
            .delete(`/users/${admin.id}`)
            .type('json')
            .set('Authorization', 'Bearer ' + memberToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(403);
    });

    test('admin should be able to delete member', async () => {
        const response = await request(Server.app)
            .delete(`/users/${member.id}`)
            .type('json')
            .set('Authorization', 'Bearer ' + adminToken)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    });
});

afterAll(function () {
    testServer.close();
});