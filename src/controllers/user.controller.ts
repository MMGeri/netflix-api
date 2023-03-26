import { Request, Response } from "express";
import users, { NewUser, User } from "../services/users-service";
import videos from "../services/video-service";
import { createSessionId } from "../utils/createId";
import { isUserLoggedIn } from "../utils/authenticate";


async function getQueue(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const sessionId = String(req.headers['X-Session-ID']);
  const queue = await users.getQueue(userId);
  if (!userExists(userId)) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  };
  if (!isUserLoggedIn(sessionId, userId)) {
    res.status(401).json({ message: 'Not logged in' });
    return;
  };
  res.json(queue);
}

async function queueVideo(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const sessionId = String(req.headers['X-Session-ID']);
  const videoId = Number(req.body.videoId);
  if (!userExists(userId)) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  };
  if (!isUserLoggedIn(sessionId, userId)) {
    res.status(401).json({ message: 'Not logged in' });
    return;
  };
  const video = await videos.findVideoById(videoId);
  if (!video) {
    res.status(404).json({ code: 404, message: 'Video not found' });
    return;
  }
  const queue = await users.queueVideo(userId, videoId);
  res.json(queue);
}

async function createUser(req: Request, res: Response) {
  const user: NewUser = req.body;
  const result = await users.createUser(user);
  res.json(result);
}

async function userLogin(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const user = await users.findUserById(userId);
  const password = req.body.password;
  const sessionId = createSessionId(32);
  if (!user) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  }
  if (user.password !== password) {
    res.status(401).json({ code: 404, message: 'Wrong password' });
    return;
  }
  globalThis.sessions.set(sessionId, { user });
  res.json({ 'session-id': sessionId });
}

async function userLogout(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const sessionId = String(req.headers['X-Session-ID']);
  if (!userExists(userId)) {
    res.status(404).json({ code: 404, message: 'User not found' });
    return;
  };
  if (!isUserLoggedIn(sessionId,userId)) {
    res.status(401).json({code:401, message: 'Not logged in' });
    return;
  };
  globalThis.sessions.delete(sessionId);
  res.status(204)
}

async function userExists(userId: number) {
  const user = await users.findUserById(userId);
  if (user)
    return true;
  return false;
}

module.exports = {
  getQueue,
  queueVideo,
  createUser,
  userLogin,
  userLogout
}



