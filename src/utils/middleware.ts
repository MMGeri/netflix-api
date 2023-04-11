import { NextFunction, Request, Response } from "express";
import sessions from "../services/sessions-service";
import users from "../services/users-service";
import { sendErrorResponse } from "./responses";
require("dotenv").config();


function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
  const apiKey = String(req.headers['x-admin-api-key']);
  if (apiKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({ message: 'Provide a valid api key' });
    return;
  };
  next();
}

async function sessionStateChecker(req: Request, res: Response, next: NextFunction) {
  const userId = String(req.params.id);
  const sessionId = String(req.headers['x-session-id']);
  try{
  var session = await sessions.findSessionById(sessionId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  if (!session || (session.user.id != userId && userId)) {
    res.status(401).json({ code: 401, message: 'Not logged in' });
    return;
  }
  next();
}

async function userResourceChecker(req: Request, res: Response, next: NextFunction) {
  const userId = String(req.params.id);
  try{
  var user = await users.findUserById(userId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  next();
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
}

export { sessionStateChecker, apiKeyValidator, userResourceChecker, errorHandler }

