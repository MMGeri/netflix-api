import { expect } from 'chai';
import axios from 'axios';
import nock from 'nock';

require("dotenv").config();

import { isError, isUser } from '../../src/utils/type-checker';
import { Video } from '../../src/services/videos-service';

const PORT = process.env.PORT || 10020;

const username = "username";
const password = "password";
const videoId = '64340d7f18acfbbf71d83d25';
const video: Video = { id: videoId, title: "The Shawshank Redemption", category: "Drama", type: "Movie" };

const API_URL = `http://localhost:${PORT}`
const KONG_API = process.env.KONG_API || "http://kong:8001"

describe('Integration tests Users resource', function () {
    const instance = axios.create({
        baseURL: API_URL,
        validateStatus: undefined
    })
    describe('POST /users', function () {
        describe('request body is correct', function () {
            it('should return response with 201 Created', async () => {
                nock(KONG_API).post("/consumers").reply(201, { username: "username" })
                nock(KONG_API).post("/consumers/username/acls").reply(201, { group: "user" })

                const newUser = { username: "username", password: "password" }
                const response = await instance.post('/users', newUser);

                expect(response.status).to.equal(201);
                expect(isUser(response.data)).to.be.true;
            })
        });
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
                const badUser = { username: "username", password: "pass", name: "John" };
                const response = await instance.post('/users', badUser);

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        });
    });

    describe('POST /users/login', function () {
        describe('password is wrong', function () {
            it('should return response with 401 Unauthorized', async () => {
                const response = await instance.post(`/users/login`, { username: "username", password: "wrongpassword" });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('password is correct', function () {
            it('should return response with 200 OK', async () => {
                nock(KONG_API)
                    .get("/consumers/username/key-auth")
                    .reply(200, {data: []})
                    .post("/consumers/username/key-auth")
                    .reply(201, {key: "key"})

                const response = await instance.post(`/users/login`, {username:"username", password });

                expect(response.status).to.equal(200);
                expect(response.data.apikey).to.be.equal('key');
            })
        })
        describe('user with username does not exist', function () {
            it('should return response with 404 Not found', async () => {

                const response = await instance.post(`/users/login`, {username:"a", password });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/logout', function () {
        describe('provided valid username in header', function () {
            it('should return response with 204 No content', async () => {
                nock(KONG_API)
                    .get("/consumers/username/key-auth")
                    .reply(200, {data: []})

                const response = await instance.get(`/users/logout`, { headers: { 'x-consumer-username': username } });

                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
        })
    })
    describe('PUT /users/queue', function () {
        describe('provided a valid video id in request body', function () {
                it('should return the updated queue', async () => {

                    const queueLength = await instance.get(`/users/queue?sort=id`, { headers: { 'x-consumer-username': username } }).then(response => response.data.length);
                    
                    const response = await instance.put(`/users/queue`, { videoId }, { headers: { 'x-consumer-username': username } });

                    expect(response.status).to.equal(200);
                    expect(response.data).to.be.an('array');
                    expect(response.data).to.deep.contain(video);
                    expect(response.data.length).to.greaterThanOrEqual(queueLength);
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
        describe('provided valid username', function () {
            it('should return the queue', async () => {

                const response = await instance.get(`/users/queue?sort=id`, { headers: { 'x-consumer-username': username} });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array')
                expect(response.data).to.deep.contain(video);
            })
        })
    })
});



