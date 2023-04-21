import { expect } from 'chai';
import axios from 'axios';
import nock from 'nock';
require("dotenv").config();

import { isError, isVideo } from '../../src/utils/type-checker';
import { NewVideo, Video } from '../../src/services/videos-service';

const PORT = process.env.PORT || 10020;

const videoId = '64340d7f18acfbbf71d83d25';

const sessionId = "6435d8059044b886fc0ed1e2";

const API_URL = `http://localhost:${PORT}`
const DB_API_URL = `http://${process.env.DB_API}:${process.env.DB_API_PORT}`;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '1234';


describe('videos resource', function () {
    this.beforeAll(() => {
        nock.cleanAll()
    })
    this.afterEach(() => {
        nock.cleanAll()
        // nock.restore() does not work
    })
    this.afterAll(() => {
        nock.cleanAll()
    })
    const instance = axios.create({
        baseURL: API_URL,
        validateStatus: undefined
    })
    describe('GET /videos', () => {
        describe('provide valid admin api key', () => {
            it('should return response with 200 OK', async () => {
                nock(DB_API_URL)
                    .get('/videos')
                    .reply(200, [{ id: videoId, title: "video", category: "category", type: "TV Show" }])

                const response = await instance.get('/videos', { headers: { 'x-admin-api-key': ADMIN_API_KEY } });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array');
                if (response.data.length > 0) {
                    expect(isVideo(response.data[0])).to.be.true;
                }
            })
        })
        describe('provide invalid admin api key', () => {
            it('should return response with 401 Unauthorized', async () => {
                const response = await instance.get('/videos', { headers: { 'x-admin-api-key': 'invalid' } });
                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('POST /videos', () => {
        describe('provide valid admin api key with valid req body', () => {
            it('should return response with 201 Created', async () => {
                nock(DB_API_URL)
                    .post('/videos')
                    .reply(201, { id: videoId, title: "video", category: "category", type: "TV Show" })

                const video: NewVideo = { title: "video", category: "category", type: "TV Show" };
                const response = await instance.post('/videos', video, { headers: { 'x-admin-api-key': ADMIN_API_KEY } });

                expect(response.status).to.equal(201);
                expect(isVideo(response.data)).to.be.true;
            })
            describe('the request body is incorrect', () => {
                it('should return response with 400 Bad Request', async () => {
                    const response = await instance.post('/videos', {}, { headers: { 'x-admin-api-key': ADMIN_API_KEY } });
                    expect(response.status).to.equal(400);

                });
            });
        })
        describe('provide invalid admin api key with valid request body', () => {
            it('should return response with 401 Unauthorized', async () => {
                const video: NewVideo = { title: "video", category: "category", type: "TV Show" };
                const response = await instance.post('/videos', video, { headers: { 'x-admin-api-key': 'invalid' } });
                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('PUT /videos/:id', () => {
        describe('provide valid admin api key with valid request body', () => {
            it('should return response with 200 OK', async () => {
                const video: NewVideo = { title: "video", category: "category", type: "TV Show" };
                nock(DB_API_URL)
                    .put(`/videos/${videoId}`, video)
                    .reply(200, { id: videoId, ...video });

                const response = await instance.put(`/videos/${videoId}`, video, { headers: { 'x-admin-api-key': ADMIN_API_KEY } });
                expect(response.status).to.equal(200);
                expect(isVideo(response.data)).to.be.true;
            })
        })
        describe('provide invalid admin api key with a valid request body', () => {
            it('should return response with 401 Unauthorized', async () => {
                const video: NewVideo = { title: "video", category: "category", type: "TV Show" };
                const response = await instance.put(`/videos/${videoId}`, video, { headers: { 'x-admin-api-key': 'invalid' } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            })
        })
    })
    describe('DELETE /videos/:id', () => {
        describe('provide valid admin api key', () => {
            it('should return response with 204 No Content', async () => {
                nock(DB_API_URL)
                    .delete(`/videos/${videoId}`)
                    .reply(204);

                const response = await instance.delete(`/videos/${videoId}`, { headers: { 'x-admin-api-key': ADMIN_API_KEY } });

                expect(response.status).to.equal(204);
                expect(response.data).to.be.empty;
            })
        })
        describe('provide invalid admin api key', () => {
            it('should return response with 401 Unauthorized', async () => {
                const response = await instance.delete(`/videos/${videoId}`, { headers: { 'x-admin-api-key': 'invalid' } });

                expect(response.status).to.equal(401);
                expect(isError(response.data)).to.be.true;
            });
        });
    })
    describe('GET /videos/search', () => {
        describe('provide valid query parameter', () => {
            it('should return response with 200 OK and an array of videos', async () => {
                nock(DB_API_URL)
                    .get(`/sessions/${sessionId}?populate=user`)
                    .reply(200, { id: sessionId, user: { id: '1234', name: 'user' } })
                    .get(/videos\?query=.*/)
                    .reply(200, [{ id: videoId, title: 'video', category: 'category', type: 'TV Show' }]);

                const response = await instance.get('/videos/search?title=T', { headers: { 'x-session-id': sessionId } });

                expect(response.status).to.equal(200);
                expect(response.data).to.be.an('array');
                if (response.data.length > 0) {
                    expect(isVideo(response.data[0])).to.be.true;
                }
            })
        });
    })
});

