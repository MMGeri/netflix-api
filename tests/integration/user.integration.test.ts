import { expect } from 'chai';
import axios from 'axios';
require("dotenv").config();

import { isError, isUser } from '../../src/utils/type-checker';
import { Video } from '../../src/services/videos-service';

const PORT = process.env.PORT || 10020;

const userId = '6441da178eef022f86fb594b';
const password = "password";

const videoId = '64340d7f18acfbbf71d83d25';
const video: Video = { id: videoId, title: "The Shawshank Redemption", category: "Drama", type: "Movie" };

const sessionId = "6435d24e9044b886fc0ecde9";

const API_URL = `http://localhost:${PORT}`

describe('Integration tests Users resource', function () {
    const instance = axios.create({
        baseURL: API_URL,
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

    describe('POST /users/:id/login', function () {
        describe('password is wrong', function () {
            it('should return response with 401 Unauthorized', async () => {
                const response = await instance.post(`/users/${userId}/login`, { password: "wrongpassword" });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is correct', function () {
            it('should return response with 200 OK', async () => {
                const response = await instance.post(`/users/${userId}/login`, { password });

                expect(response.status).to.equal(200);
                expect(response.data['session-id']).to.be.a('string');
                expect(response.data['session-id']).to.have.lengthOf(24);
            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', async () => {

                const response = await instance.post(`/users/000000000000000000000000/login`, { password });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/:id/logout', function () {
        describe('provided valid session id', function () {
            it('should return response with 204 No content', async () => {
                const sessionId = await instance.post(`/users/${userId}/login`, { password }).then(response => response.data['session-id']);

                const response = await instance.get(`/users/${userId}/logout`, { headers: { 'x-session-id': sessionId } });
                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
        })
        describe('incorrect session id', function () {
            it('should return response with 401 Unauthorized', async () => {
                const response = await instance.get(`/users/${userId}/logout`, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('PUT /users/:id/queue', function () {
        describe('provided a valid video id in request body', function () {
            describe('provided valid session id', function () {
                it('should return the updated queue', async () => {
                    const sessionId = await instance.post(`/users/${userId}/login`, { password }).then(response => response.data['session-id']);
                    const queueLength = await instance.get(`/users/${userId}/queue?sort=id`, { headers: { 'x-session-id': sessionId } }).then(response => response.data.length);
                    
                    const response = await instance.put(`/users/${userId}/queue`, { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(200);
                    expect(response.data).to.be.an('array');
                    expect(response.data).to.deep.contain(video);
                    expect(response.data.length).to.greaterThanOrEqual(queueLength);
                })
            })
            describe('incorrect session id', function () {
                it('should return response with 401 Unauthorized', async () => {

                    const response = await instance.put(`/users/${userId}/queue`, { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(401);
                    expect(isError(response.data)).to.be.true;
                })
            })
            describe('user with id does not exist', function () {
                it('should return response with 404 Not found', async () => {

                    const response = await instance.put(`/users/6441da178eef022f86f31823/queue`, { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                })
            })
        })
        describe('provided an invalid video in request body with valid user id and valid session id', function () {
            it('should return response with 400 Bad request', async function () {
                const response = await instance.put(`/users/${userId}/queue`, { something: 123 }, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })

    })
    describe('GET /users/:id/queue?sort=id', function () {
        describe('provided valid session id', function () {
            it('should return the queue', async () => {
                const sessionId = await instance.post(`/users/${userId}/login`, { password }).then(response => response.data['session-id']);

                const response = await instance.get(`/users/${userId}/queue?sort=id`, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array')
                expect(response.data).to.deep.contain(video);
                expect(response.data.length).to.equal(3);
            })
        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', async function () {

                const response = await instance.get(`/users/${userId}/queue?sort=id`, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', async function () {

                const response = await instance.get(`/users/6441da178eef022f86f12341/queue?sort=id`, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
});



