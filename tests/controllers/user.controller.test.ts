import { expect } from 'chai';
import axios from 'axios';
import { NewUser, User } from '../../src/services/users-service';
import sinon from 'sinon';


describe('users resource', function () {
    this.afterEach(() => {
        sinon.restore();
    });
    const instance = axios.create({
        baseURL: 'http://localhost:3000',
        validateStatus: undefined
    })
    describe('POST /users', function () {
        describe('request body is correct', function () {
            it('should return response with 201 Created', async () => {
                const user: NewUser = { email: "example@gmail.com", password: "password123" };
                const response = await instance.post('/users', user);
                expect(response.status).to.equal(201);
                expect(isUser(response.data)).to.be.true;
            })
        });
        describe('email is wrong', function () {
            it('should return response with 400 Bad Request', async () => {
                const user: NewUser = { email: "examplegmail.com", password: "password123" };
                const response = await instance.post('/users', user);
                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is too short', function () {
            it('should return response with 400 Bad Request', async () => {
                const user: NewUser = { email: "example@gmail.com", password: "pass" };
                const response = await instance.post('/users', user);
                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('password is too long', function () {
            it('should return response with 400 Bad Request', async () => {
                const user: NewUser = { email: "example@gmail.com", password: "12345678912345678" };
                const response = await instance.post('/users', user);
                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('request body is incorrect', function () {
            it('should return response with 400 Bad Request', async () => {
                const user = { email: "examplegmail.com", password: "pass", name: "John" };
                const response = await instance.post('/users', user);
                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
    });

    describe('POST /users/1/login', function () {
        describe('password is wrong', function () {
            it('should return response with 401 Unauthorized', async () => {
                const password = "wrongpassword";
                const response = await instance.post('/users/1/login', { password });
                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is correct', function () {
            it('should return response with 200 OK', async () => {
                const password = "password123";
                const response = await instance.post('/users/1/login', { password });
                expect(response.status).to.equal(200);
                expect(response.data['session-id']).to.be.a('string');
                expect(response.data['session-id']).to.have.lengthOf(32);
            })
        })
        describe('user with id 0 does not exist', function () {
            it('should return response with 404 Not found', async () => {
                const password = "password123";
                const response = await instance.post('/users/0/login', { password });
                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/1/logout', function () {
        describe('provided valid session id', function () {
            it('should return response with 204 No content', async () => {
                //TODO: hogyan lepjek ki ha elotte be kell lépnem? hogyan mockoljak sessions-be letezo sessiont?
            })
        })
        describe('incorrect session id', function () {
            it('should return response with 401 Unauthorized', async () => {
                const sessionId = "12345678901234567890123456789012";
                const response = await instance.get('/users/1/logout', { headers: { 'session-id': sessionId } });
                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id 0 does not exist', function () {
            it('should return response with 404 Not found', async () => {
                const response = await instance.get('/users/0/logout');
            })
        })
    })
    describe('PUT /users/1/queue', function () {
        describe('provided valid session id', function () {

        })
        describe('incorrect session id', function () {
            it('should return response with 401 Unauthorized', function () {

            })
        })
        describe('user with id 0 does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
    describe('GET /users/1/queue', function () {
        describe('provided valid session id', function () {

        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', function () {

            })
        })
        describe('user with id 0 does not exist', function () {
            it('should return response with 404 Not found', function () {

            })
        })
    })
});

function isUser(obj: any): obj is User {
    if (obj.id && obj.email && obj.password)
        return true
    return false;
}

function isError(obj: any): obj is Error {
    if (obj.code && obj.message)
        return true
    return false;
}