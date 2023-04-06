import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';

import { isError, isUser } from '../../src/utils/type-checker';
import users, {  User } from '../../src/services/users-service';
import sessions from '../../src/services/sessions-service';
import videos, { Video } from '../../src/services/videos-service';

const userId = 1;
const password = "password";
const email = "example@example.com"

const user: User = { id: userId, email, password };

const videoId = 1;
const video: Video = { id: videoId, title: "video", category: "category", type: "TV Show" };

const sessionId = "12345678901234567890123456789012";


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
                const newUser = { email: "example@example.com", password: "password" }
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(201);
                expect(isUser(response.data)).to.be.true;
            })
        });
        describe('email is wrong', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { email: "exampleexample.com", password: "password", name: "John" }
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is too short', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { email: "example@example.com", password: "pass" };
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('password is too long', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { email: "example@example.com", password: "passpasspasspaapsdpaspdpaspdpaspdpaspsd" };
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('request body is incorrect', function () {
            it('should return response with 400 Bad Request', async () => {
                const badUser = { email: "exampleexample.com", password: "pass", name: "John" };
                const response = await instance.post('/users', badUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
    });

    describe('POST /users/1/login', function () {
        describe('password is wrong', function () {
            it('should return response with 401 Unauthorized', async () => {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(user)));

                const response = await instance.post('/users/1/login', { password: "wrongpassword" });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is correct', function () {
            it('should return response with 200 OK', async () => {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(user)));
                sinon.stub(sessions, "createSession")
                    .withArgs({ user })
                    .returns(new Promise(res => res(sessionId)))

                const response = await instance.post(`/users/1/login`, { password });

                expect(response.status).to.equal(200);
                expect(response.data['session-id']).to.be.a('string');
                expect(response.data['session-id']).to.have.lengthOf(32);
                expect(response.data['session-id']).to.equal(sessionId);
            })
        })
        describe('user with id 1 does not exist', function () {
            it('should return response with 404 Not found', async () => {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(undefined)));

                const response = await instance.post(`/users/1/login`, { password });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/1/logout', function () {
        describe('provided valid session id', function () {
            it('should return response with 204 No content', async () => {
                sinon.stub(sessions, "findSessionById")
                    .withArgs(sessionId)
                    .returns(new Promise(res => res({ user })));

                const response = await instance.get(`/users/1/logout`, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
        })
        describe('incorrect session id', function () {
            it('should return response with 401 Unauthorized', async () => {
                sinon.stub(sessions, "findSessionById")
                    .withArgs(sessionId)
                    .returns(new Promise(res => res(undefined)));

                const response = await instance.get('/users/1/logout', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id 1 does not exist', function () {
            it('should return response with 404 Not found', async () => {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(undefined)));

                const response = await instance.get(`/users/1/logout`);

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('PUT /users/1/queue', function () {
        describe('provided a valid video id in request body', function () {
            describe('provided valid session id', function () {
                it('should return the updated queue', async () => {
                    sinon.stub(users, "findUserById")
                        .withArgs(1)
                        .returns(new Promise(res => res(user)));
                    sinon.stub(sessions, "findSessionById")
                        .withArgs(sessionId)
                        .returns(new Promise(res => res({ user })));
                    sinon.stub(videos, "findVideoById")
                        .withArgs(1)
                        .returns(new Promise(res => res(video)));

                    const response = await instance.put('/users/1/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(200);
                    expect(response.data).to.be.an('array');
                    expect(response.data).to.deep.contain(video);
                })
            })
            describe('incorrect session id', function () {
                it('should return response with 401 Unauthorized', async () => {
                    sinon.stub(sessions, "findSessionById")
                        .withArgs(sessionId)
                        .returns(new Promise(res => res(undefined)));
                    sinon.stub(videos, "findVideoById")
                        .withArgs(videoId)
                        .returns(new Promise(res => res(video)));

                    const response = await instance.put('/users/1/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(401);
                    expect(isError(response.data)).to.be.true;
                })
            })
            describe('user with id 1 does not exist', function () {
                it('should return response with 404 Not found', async () => {
                    sinon.stub(users, "findUserById")
                        .withArgs(1)
                        .returns(new Promise(res => res(undefined)));

                    const response = await instance.put('/users/1/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                })
            })
        })
        describe('provided an invalid video in request body with valid user id and valid session id', function () {
            it('should return response with 400 Bad request', async function () {
                const sessionId = "12345678901234567890123456789012";
                const videoId = 1;
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res({ id: 1, email: "example@example.com", password: "password" })));
                sinon.stub(sessions, "findSessionById")
                    .withArgs(sessionId)
                    .returns(new Promise(res => res({ user: { id: 1, email: "example@example.com", password: "password" } })));
                sinon.stub(videos, "findVideoById")
                    .withArgs(videoId)
                    .returns(new Promise(res => res(undefined)));

                const response = await instance.put('/users/1/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })

    })
    describe('GET /users/1/queue?sort=id', function () {
        describe('provided valid session id', function () {
            it('should return the queue', async () => {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(user)));
                sinon.stub(sessions, "findSessionById")
                    .withArgs(sessionId)
                    .returns(new Promise(res => res({ user })));
                sinon.stub(users, "getQueueByUserId")
                    .withArgs(1)
                    .returns(new Promise(res => res([video])));

                const response = await instance.get('/users/1/queue?sort=id', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array')
                expect(response.data).to.deep.contain(video);
                expect(response.data.length).to.equal(1);
            })
        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', async function () {
                sinon.stub(sessions, "findSessionById")
                    .withArgs(sessionId)
                    .returns(new Promise(res => res(undefined)));
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(user)));
                
                const response = await instance.get('/users/1/queue?sort=id', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id 1 does not exist', function () {
            it('should return response with 404 Not found', async function () {
                sinon.stub(users, "findUserById")
                    .withArgs(1)
                    .returns(new Promise(res => res(undefined)));

                const response = await instance.get('/users/1/queue?sort=id', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
});


