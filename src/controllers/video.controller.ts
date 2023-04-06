import { Request, Response } from 'express';
import videos from '../services/videos-service';
import { apiKeyValidator } from '../utils/middleware';

  
async function createVideo(req: Request, res: Response) {
  const video = req.body;
  const result = await videos.createVideo(video);
  res.json(result);
}

async function deleteVideo(req: Request, res: Response) {
  const videoId = String(req.params.id);
  const result = await videos.deleteVideo(videoId);
  if (!result) {
    res.status(404).json({code:404, message: 'Video not found' });
    return;
  }
  res.json(result);
}

async function getVideos(req: Request, res: Response) {
  const result = await videos.getVideos();
  res.json(result);
}

async function searchVideos(req: Request, res: Response) {
  const query = String(req.query.query);
  const result = await videos.searchVideos(query);
  res.json(result);
}

async function changeVideo(req: Request, res: Response) {
  const videoId = String(req.params.id);
  const video = req.body;
  const result = await videos.updateVideo(videoId, video);  
  if (!result) {
    res.status(404).json({code:404, message: 'Video not found' });
    return;
  }
  res.json(result);
}


  module.exports = {
    changeVideo:[apiKeyValidator,changeVideo],
    createVideo:[apiKeyValidator,createVideo],
    deleteVideo:[apiKeyValidator,deleteVideo],
    getVideos:[apiKeyValidator,getVideos],
    searchVideos
  };
  