import { Request, Response } from "express";
import users, { NewUser } from "../services/users-service";
import sessions from "../services/sessions-service";
import videos from "../services/videos-service";
import { sessionStateChecker, userResourceChecker } from "../utils/middleware";
import { sendErrorResponse } from "../utils/responses";

async function createUser(req: Request, res: Response) {
  const user: NewUser = req.body;
  try {
    var result = await users.createUser(user);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.status(201).json(result);
}

async function userLogin(req: Request, res: Response) {
  const userId = String(req.params.id);
  try {
    var user = await users.findUserById(userId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  const password = req.body.password;
  if (user.password !== password) {
    res.status(401).json({ code: 401, message: 'Wrong password' });
    return;
  }
  try {
    var sessionId = await sessions.createSession({ user });
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json({ 'session-id': sessionId });
}

async function getQueue(req: Request, res: Response) {
  const userId = String(req.params.id);
  try {
    var queue = await users.getQueueByUserId(userId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(queue);
}

async function queueVideo(req: Request, res: Response) {
  const videoId = String(req.body.videoId);
  try {
    const video = await videos.findVideoById(videoId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  const userId = String(req.params.id);
  try {
    var queue = await users.queueVideo(userId, videoId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(queue);
}

async function userLogout(req: Request, res: Response) {
  const sessionId = String(req.headers['x-session-id']);
  try {
    await sessions.deleteSession(sessionId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.status(204).send();
}

module.exports = {
  getQueue: [userResourceChecker, sessionStateChecker, getQueue],
  queueVideo: [userResourceChecker, sessionStateChecker, queueVideo],
  userLogout: [userResourceChecker, sessionStateChecker, userLogout],
  userLogin: [userResourceChecker, userLogin],
  createUser
}



