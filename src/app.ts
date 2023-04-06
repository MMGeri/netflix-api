import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import * as OpenApiValidator from 'express-openapi-validator';
import { errorHandler } from './utils/middleware';

const port = 10020;
const app: Application = express();
const apiSpec = path.join(__dirname, 'api/api.yaml');
const openApiValidator = OpenApiValidator.middleware({
  apiSpec,
  operationHandlers: path.join(__dirname)
})

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use('/spec', express.static(apiSpec));
app.use(openApiValidator);
app.use(errorHandler);

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;


