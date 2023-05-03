import { Request, Response } from "express";
import usersService, { NewUser } from "../services/users-service";
import videosService from "../services/videos-service";
import kongService from "../services/kong-service";

async function createUser(req: Request, res: Response, next: any) {
  try {
    const user: NewUser = req.body;
    const result = await usersService.createUser(user)
    await kongService.createConsumer(user.username);
    await kongService.addUserToAcl(user.username, 'user');
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function userLogin(req: Request, res: Response, next: any) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await usersService.findUserByUsername(username);
    if (!user) {
      res.status(404).json({ code: 404, message: 'User not found' });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ code: 401, message: 'Wrong password' });
      return;
    }
    const apikey = await kongService.createApiKey(username);
    res.json({ apikey: apikey.key });
  } catch (error) {
    next(error);
  }
}

async function userLogout(req: Request, res: Response, next: any) {
  try {
    const username = String(req.headers['x-consumer-username']);
    const apikeys = await kongService.getApiKeysOfUser(username);
    for (const apikey of apikeys) {
      if(apikey?.key){
        await kongService.deleteApiKey(username, apikey.key);
      }
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getQueue(req: Request, res: Response, next: any) {
  try {
    const username = String(req.headers['x-consumer-username']);
    const sortBy = String(req.query.sort);

    const queue = await usersService.getQueueByUsername(username, sortBy);

    res.json(queue);
  } catch (error) {
    next(error);
  }
}

async function queueVideo(req: Request, res: Response, next: any) {
  try {
    const username = String(req.headers['x-consumer-username']);
    const videoId = String(req.body.videoId);
    const video = await videosService.findVideoById(videoId);
    if (!video) {
      res.status(404).json({ code: 404, message: 'Video not found' });
      return;
    }
    const queue = await usersService.queueVideo(username, videoId);
    res.json(queue);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getQueue: [getQueue],
  queueVideo: [queueVideo],
  userLogout: [userLogout],
  userLogin: [userLogin],
  createUser
}



