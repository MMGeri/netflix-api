import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import axios from 'axios';
import * as OpenApiValidator from 'express-openapi-validator';
import { errorHandler } from './utils/middleware';
require('dotenv').config();

const port = process.env.PORT || 10020;
const app: Application = express();
const apiSpec = path.join(__dirname, 'api/api.yaml');
const openApiValidator = OpenApiValidator.middleware({
  apiSpec,
  operationHandlers: path.join(__dirname)
})

axios.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 404) {
      return Promise.resolve(undefined)
    }
    if (error?.response?.status === 409) {
      return Promise.reject({
        code: 409,
        message: "Resource already exists"
      })
    }
    console.error(error);
    return Promise.reject({
      code: 500,
      message: "There was an internal server error while processing your request, please try again later"
    })
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use('/spec', express.static(apiSpec));
app.use(openApiValidator);
app.use(errorHandler);

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;


