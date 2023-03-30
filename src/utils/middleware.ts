import { NextFunction, Request, Response } from "express";
import sessions from "../services/sessions-service";
import users from "../services/users-service";

const adminApiKey = '1234';

function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
  const apiKey = String(req.headers['X-Admin-API-key']);
  if (apiKey !== adminApiKey) {
    res.status(401).json({ message: 'Provide a valid api key' });
    return;
  };
  next();
}

async function sessionStateChecker(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.params.id);
  const sessionId = String(req.headers['x-session-id']);
  const session = await sessions.findSessionById(sessionId);
  if (!session || (session.user.id != userId && userId)) {
    res.status(401).json({ code: 401, message: 'Not logged in' });
    return;
  }
  next();
}

async function userResourceChecker(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.params.id);
  const user = await users.findUserById(userId);
  if (!user) {
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

export { sessionStateChecker, apiKeyValidator, userResourceChecker, errorHandler }

