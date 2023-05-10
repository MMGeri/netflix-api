import { NextFunction, Request, Response } from "express";
require("dotenv").config();

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
}

export { errorHandler }

