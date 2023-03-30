import express, { Application } from 'express';
import path from 'path';
import logger from 'morgan';
import http from 'http';
import * as OpenApiValidator from 'express-openapi-validator';
import { errorHandler } from './utils/middleware';

const port = 3000;
const app: Application = express();
const apiSpec = path.join(__dirname, 'api/api.yaml');
const openApiValidator = OpenApiValidator.middleware({
  apiSpec,
  operationHandlers: path.join(__dirname), //TODO: https://stackoverflow.com/questions/64731421/how-to-add-custom-middleware-to-express-openapi-validator-using-swagger-3
  validateRequests: true,
  validateResponses: true,
})
global.sessions = new Map();

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
// app.use(logger('combined'));
app.use('/spec', express.static(apiSpec));
app.use(openApiValidator);
app.use(errorHandler);

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;


