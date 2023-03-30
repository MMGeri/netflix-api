import { Request, Response } from "express";
import users, { NewUser } from "../services/users-service";
import videos from "../services/video-service";
import { createSessionId } from "../utils/createId";
import { loginStateChecker, userResourceChecker } from "../utils/middleware";

async function createUser(req: Request, res: Response) {
  const user: NewUser = req.body;
  const result = await users.createUser(user);
  res.status(201).json(result);
}

async function userLogin(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const user = await users.findUserById(userId);
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }
  const password = req.body.password;
  if (user.password !== password) {
    res.status(401).json({ code: 404, message: 'Wrong password' });
    return;
  }
  const sessionId = createSessionId(32);
  global.sessions.set(sessionId, { user });
  res.json({ 'session-id': sessionId });
}

async function getQueue(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const queue = await users.getQueue(userId);
  res.json(queue);
}

async function queueVideo(req: Request, res: Response) {
  const videoId = Number(req.body.videoId);
  const video = await videos.findVideoById(videoId);
  if (!video) {
    res.status(404).json({ code: 404, message: 'Video not found' });
    return;
  }
  const userId = Number(req.params.id);
  const queue = await users.queueVideo(userId, videoId);
  res.json(queue);
}

async function userLogout(req: Request, res: Response) {
  const sessionId = String(req.headers['X-Session-ID']);
  global.sessions.delete(sessionId);
  res.status(204)
}

module.exports = {
  getQueue:[userResourceChecker,loginStateChecker,getQueue],
  queueVideo:[userResourceChecker,loginStateChecker,queueVideo],
  userLogout:[userResourceChecker,loginStateChecker,userLogout],
  userLogin:[userResourceChecker,userLogin],
  createUser
}



