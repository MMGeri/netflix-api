import { Request, Response } from 'express';
import videos from '../services/video-service';
import { isApiKey, isUserLoggedIn } from '../utils/authenticate';

  
async function createVideo(req: Request, res: Response) {
  const video = req.body;
  const result = await videos.createVideo(video);
  res.json(result);
}

async function deleteVideo(req: Request, res: Response) {
  const apiKey = String(req.headers['X-Admin-API-key']);
  if(!isApiKey(apiKey)) {
    res.status(401).json({ message: 'Provide a valid api key' });
    return;
  };
  const videoId = Number(req.params.id);
  const result = await videos.deleteVideo(videoId);
  if (!result) {
    res.status(404).json({code:404, message: 'Video not found' });
    return;
  }
  res.json(result);
}

async function getVideos(req: Request, res: Response) {
  const apiKey = String(req.headers['X-Admin-API-key']);
  if(!isApiKey(apiKey)) {
    res.status(401).json({ message: 'Provide a valid api key' });
    return;
  };
  const result = await videos.getVideos();
  res.json(result);
}

async function searchVideos(req: Request, res: Response) {
  const sessionId = String(req.query.sessionId);
  if (!isUserLoggedIn(sessionId)) {
    res.status(401).json({ message: 'Not logged in' });
    return;
  };
  const query = String(req.query.query);
  const result = await videos.searchVideos(query);
  res.json(result);
}

async function changeVideo(req: Request, res: Response) {
  const apiKey = String(req.headers['X-Admin-API-key']);
  if(!isApiKey(apiKey)) {
    res.status(401).json({ message: 'Provide a valid api key' });
    return;
  };
  const videoId = Number(req.params.id);
  const video = req.body;
  const result = await videos.updateVideo(videoId, video);  
  if (!result) {
    res.status(404).json({code:404, message: 'Video not found' });
    return;
  }
  res.json(result);
}


  module.exports = {
    changeVideo,
    createVideo,
    deleteVideo,
    getVideos,
    searchVideos
  };
  