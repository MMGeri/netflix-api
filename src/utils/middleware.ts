import { NextFunction, Request, Response } from "express";
import sessions from "../services/sessions-service";
import users from "../services/users-service";
import { sendErrorResponse } from "./responses";
require("dotenv").config();

async function sessionStateChecker(req: Request, res: Response, next: NextFunction) {
  const sessionId = String(req.headers['x-session-id']);
  try{
  var session = await sessions.findSessionById(sessionId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  if (!session) {
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
  if(!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
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

export { sessionStateChecker, userResourceChecker, errorHandler }

