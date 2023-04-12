import { expect } from 'chai';
import axios from 'axios';

import { isError, isUser } from '../../src/utils/type-checker';
import  { Video } from '../../src/services/videos-service';

const PORT = process.env.PORT || 10020;

const userId = '64340e3e18acfbbf71d83d2b';
const password = "password123";

const videoId = '64340d7f18acfbbf71d83d25';
const video: Video = { id: videoId, title: "video", category: "category", type: "TV Show" };

const sessionId = "6435d24e9044b886fc0ecde9";


describe('users resource', function () {
    const instance = axios.create({
        baseURL: `http://localhost:${PORT}`,
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

    describe('POST /users/64340e3e18acfbbf71d83d2b/login', function () {
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
                //FIXME: expect(response.data['session-id']).to.equal(sessionId);
            })
        })
        describe('user with id 000000000000000000000000 does not exist', function () {
            it('should return response with 404 Not found', async () => {

                const response = await instance.post(`/users/000000000000000000000000/login`, { password });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('GET /users/64340e3e18acfbbf71d83d2b/logout', function () {
        describe('provided valid session id', function () {
            it('should return response with 204 No content', async () => {

                const response = await instance.get(`/users/${userId}/logout`, { headers: { 'x-session-id': sessionId } });
                //FIXME: mock
                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
        })
        describe('incorrect session id', function () {
            it('should return response with 401 Unauthorized', async () => {

                const response = await instance.get('/users/64340e3e18acfbbf71d83d2b/logout', { headers: { 'x-session-id': sessionId } });
              
                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id 64340e3e18acfbbf71d83d2e does not exist', function () {
            it('should return response with 404 Not found', async () => {

                const response = await instance.get(`/users/64340e3e18acfbbf71d83d2e/logout`);

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('PUT /users/64340e3e18acfbbf71d83d2b/queue', function () {
        describe('provided a valid video id in request body', function () {
            describe('provided valid session id', function () {
                it('should return the updated queue', async () => {

                    const response = await instance.put('/users/64340e3e18acfbbf71d83d2b/queue', { videoId }, { headers: { 'x-session-id': sessionId } });
                    //FIXME: mock session id
                    expect(response.status).to.equal(200);
                    expect(response.data).to.be.an('array');
                    expect(response.data).to.deep.contain(video);
                })
            })
            describe('incorrect session id', function () {
                it('should return response with 401 Unauthorized', async () => {

                    const response = await instance.put('/users/64340e3e18acfbbf71d83d2b/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                    expect(response.status).to.equal(401);
                    expect(isError(response.data)).to.be.true;
                })
            })
            describe('user with id 64340e3e18acfbbf71d83d2e does not exist', function () {
                it('should return response with 404 Not found', async () => {

                    const response = await instance.put('/users/64340e3e18acfbbf71d83d2e/queue', { videoId }, { headers: { 'x-session-id': sessionId } });
                    
                    expect(response.status).to.equal(404);
                    expect(isError(response.data)).to.be.true;
                })
            })
        })
        describe('provided an invalid video in request body with valid user id and valid session id', function () {
            it('should return response with 400 Bad request', async function () {
                const sessionId = "12345678901234567890123456789012";
                const videoId = '1';

                const response = await instance.put('/users/64340e3e18acfbbf71d83d2b/queue', { videoId }, { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(400);
                expect(isError(response.data)).to.be.true;
            })
        })

    })
    describe('GET /users/64340e3e18acfbbf71d83d2b/queue?sort=id', function () {
        describe('provided valid session id', function () {
            it('should return the queue', async () => {

                const response = await instance.get('/users/64340e3e18acfbbf71d83d2b/queue?sort=id', { headers: { 'x-session-id': sessionId } });
                //FIXME: mock
                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array')
                expect(response.data).to.deep.contain(video);
                expect(response.data.length).to.equal(3);
            })
        })
        describe('no or incorrect session id', function () {
            it('should return response with 401 Unauthorized', async function () {
                
                const response = await instance.get('/users/64340e3e18acfbbf71d83d2b/queue?sort=id', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
        describe('user with id 64340e3e18acfbbf71d83d2e does not exist', function () {
            it('should return response with 404 Not found', async function () {


                const response = await instance.get('/users/64340e3e18acfbbf71d83d2e/queue?sort=id', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(404);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
});


