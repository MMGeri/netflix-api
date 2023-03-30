import { NextFunction, Request, Response } from "express";
import users from "../services/users-service";

const adminApiKey = '1234';

function loginStateChecker(req: Request, res: Response, next: Function) {
  const userId = Number(req.params.id);
  const sessionId = String(req.headers['X-Session-ID']);
  const session = sessions.get(sessionId);
  if (!session || (session.user.id != userId && userId)) {
    res.status(401).json({ message: 'Not logged in' });
    return;
  }
  next();
}

function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
  const apiKey = String(req.headers['X-Admin-API-key']);
  if (apiKey === adminApiKey) {
    next();
  };
  res.status(401).json({ message: 'Provide a valid api key' });
}

async function userResourceChecker(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.params.id);
  const user = await users.findUserById(userId);
  if (user) {
    next();
  }
  res.status(404).json({ code: 404, message: 'User not found' });
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500).json({
    code: err.status,
    message: err.message,
  });
}



export { loginStateChecker, apiKeyValidator, userResourceChecker, errorHandler }

