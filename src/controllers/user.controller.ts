import { Request, Response } from "express";
import users, { NewUser } from "../services/users-service";
import sessions from "../services/sessions-service";
import videos from "../services/videos-service";
import { sessionStateChecker, userResourceChecker } from "../utils/middleware";

async function createUser(req: Request, res: Response) {
  const user: NewUser = req.body;
  const result = await users.createUser(user);
  res.status(201).json(result);
}

async function userLogin(req: Request, res: Response) {
  const userId = String(req.params.id);
  const user = await users.findUserById(userId);
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }
  const password = req.body.password;
  if (user.password !== password) {
    res.status(401).json({ code: 401, message: 'Wrong password' });
    return;
  }
  const sessionId = await sessions.createSession({user});
  res.json({ 'session-id': sessionId });
}

async function getQueue(req: Request, res: Response) {
  const userId = String(req.params.id);
  const queue = await users.getQueueByUserId(userId);
  res.json(queue);
}

async function queueVideo(req: Request, res: Response) {
  const videoId = String(req.body.videoId);
  const video = await videos.findVideoById(videoId);
  if (!video) {
    res.status(404).json({ code: 404, message: 'Video not found' });
    return;
  }
  const userId = String(req.params.id);
  const queue = await users.queueVideo(userId, videoId);
  res.json(queue);
}

async function userLogout(req: Request, res: Response) {
  const sessionId = String(req.headers['x-session-id']);
  await sessions.deleteSession(sessionId);
  res.status(204).send();
}

module.exports = {
  getQueue:[userResourceChecker,sessionStateChecker,getQueue],
  queueVideo:[userResourceChecker,sessionStateChecker,queueVideo],
  userLogout:[userResourceChecker,sessionStateChecker, userLogout],
  userLogin:[userResourceChecker,userLogin],
  createUser
}



