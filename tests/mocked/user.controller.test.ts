import { expect } from 'chai';
import axios from 'axios';
import nock from 'nock';
require("dotenv").config();

import { isError, isUser } from '../../src/utils/type-checker';
import { Video } from '../../src/services/videos-service';

const PORT = process.env.PORT || 10020;

const userId = '64340e3e18acfbbf71d83d2b';
const username = "username";
const password = "password";

const videoId = '64340d7f18acfbbf71d83d25';
const video: Video = { id: videoId, title: "video", category: "category", type: "TV Show" };

const API_URL = `http://localhost:${PORT}`
const DB_API_URL = process.env.DB_API || "http://localhost:10021";
const KONG_API_URL = process.env.KONG_API || "http://kong:81";


describe('Mocked Users resource', function () {
    this.beforeAll(() => {
        nock.cleanAll()
    })

    this.afterEach(() => {
        nock.cleanAll()
        // nock.restore() does not work
    })
    const instance = axios.create({
        baseURL: API_URL,
        validateStatus: undefined
    })

    this.afterAll(() => {
        nock.cleanAll()
    })

    describe('POST /users', function () {
        describe('request body is correct', function () {
            it('should return response with 201 Created', async () => {
                nock(DB_API_URL)
                    .get(/\/users.*/)
                    .reply(200, [{ id: userId, username: "username", password: password }])
                    .persist()
                    .post('/users')
                    .reply(201, { id: userId, username: "username", password: "password" })

                const newUser = { username: "username", password: "password" }
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(201);
                expect(isUser(response.data)).to.be.true;
            })
        });
        describe('username is wrong', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { username: "exampleexample.com", password: "password", name: "John" }
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is too short', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { username: "username", password: "pass" };
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('password is too long', function () {
            it('should return response with 400 Bad Request', async () => {
                const newUser = { username: "username", password: "passpasspasspaapsdpaspdpaspdpaspdpaspsd" };
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
        describe('request body is incorrect', function () {
            it('should return response with 400 Bad Request', async () => {
                const badUser = { username: "exampleexample.com", password: "pass", name: "John" };
                const response = await instance.post('/users', badUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
    });

    describe('POST /users/login', function () {
        describe('password is wrong', function () {
            it('should return response with 401 Unauthorized', async () => {
                nock(DB_API_URL)
                    .get(/\/users.*/)
                    .reply(200, [{ id: userId, username: "username", password: password }])
                    .persist()
                nock(KONG_API_URL)
                    .get(`/consumers/${username}/key-auth`)
                    .reply(200, {data: [{ key: 'key' }]})
                    .post(`/consumers/${username}/key-auth`)
                    .reply(201, { key: 'key' })

                const response = await instance.post(`/users/login`, { username ,password: "wrongpassword" });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is correct', function () {
            it('should return response with 200 OK', async () => {
                nock(DB_API_URL)
                    .get(/\/users.*/)
                    .reply(200, [{ id: userId, username: "username", password: password }])
                    .persist()
                nock(KONG_API_URL)
                    .get(`/consumers/${username}/key-auth`)
                    .reply(200, {data: [{ key: 'key' }]})
                    .post(`/consumers/${username}/key-auth`)
                    .reply(201, { key: 'key' })

                const response = await instance.post(`/users/login`, {username , password });

                expect(response.status).to.equal(200);
                expect(response.data.apikey).to.be.a('string');
                expect(response.data.apikey).to.equal('key');
            })
        })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', async () => {
                nock(DB_API_URL)
                    .get(`/users/000000000000000000000000`)
                    .reply(404)

                const response = await instance.post(`/users/000000000000000000000000/login`, { password });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/logout', function () {
            it('should return response with 204 No content', async () => {
                nock(KONG_API_URL)
                    .get(`/consumers/${username}/key-auth`)
                    .reply(200, {data: [{id:'key', key: 'key' }]})
                    .delete(`/consumers/${username}/key-auth/key`)
                    .reply(204)

                const response = await instance.get(`/users/logout`, { headers: { 'x-consumer-username': username } });
                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
    })
    describe('PUT /users/queue', function () {
        describe('provided a valid video id in request body', function () {
                it('should return the updated queue', async () => {
                    nock(DB_API_URL)
                       .get(/users\?query=.*/)
                        .reply(200, { id: userId, username: "username", password: password })
                        .persist()
                        .get(`/videos/${videoId}`)
                        .reply(200, video)
                        .put(`/users/${username}/queue/${videoId}`)
                        .reply(200, [video])

                    const response = await instance.put(`/users/queue`, { videoId }, { headers: { 'x-consumer-username': username } });

                    expect(response.status).to.equal(200);
                    expect(response.data).to.be.an('array');
                    expect(response.data).to.deep.contain(video);
                })
            describe('user with id does not exist', function () {
                it('should return response with 404 Not found', async () => {
                    nock(DB_API_URL)
                       .get(/users\?query=.*/)
                        .reply(404)

                    const response = await instance.put(`/users/${userId}/queue`, { videoId }, { headers: { 'x-consumer-username': username } });

                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                })
            })
        })
        describe('provided an invalid video in request body with valid username', function () {
            it('should return response with 400 Bad request', async function () {

                const response = await instance.put(`/users/queue`, { something: 123 }, { headers: { 'x-consumer-username': username } });

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })

    })
    describe('GET /users/queue?sort=id', function () {
            it('should return the queue', async () => {
                nock(DB_API_URL)
                   .get(/users\?query=.*/)
                    .reply(200, { id: userId, username: "username", password: password })
                    .persist()
                    .get(`/users/${username}/queue?sort=id`)
                    .reply(200, [video])

                const response = await instance.get(`/users/queue?sort=id`, { headers: { 'x-consumer-username': username } });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array')
                expect(response.data).to.deep.contain(video);
                expect(response.data.length).to.equal(1);
            })
        describe('user with id does not exist', function () {
            it('should return response with 404 Not found', async function () {
                nock(DB_API_URL)
                   .get(/users\?query=.*/)
                    .reply(404)

                const response = await instance.get(`/users/${userId}/queue?sort=id`, { headers: { 'x-consumer-username': username } });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
});



