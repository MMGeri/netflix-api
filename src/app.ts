import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import logger from 'morgan';
import http from 'http';
import * as OpenApiValidator from 'express-openapi-validator';

const port = 3000;
const app: Application = express();
const apiSpec = path.join(__dirname, 'api/api.yaml');
global.sessions = new Map();

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

// app.use(logger('combined')); zavar
app.use('/spec', express.static(apiSpec));

app.use(
  OpenApiValidator.middleware({
    apiSpec,
    operationHandlers: path.join(__dirname), 
    validateRequests: true,
    validateResponses: true,
  }),
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
});

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

// for testing purposes
module.exports = app;


