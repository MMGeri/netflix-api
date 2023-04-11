import { Request, Response } from 'express';
import videos from '../services/videos-service';
import { apiKeyValidator } from '../utils/middleware';
import { sendErrorResponse } from '../utils/responses';


async function createVideo(req: Request, res: Response) {
  const video = req.body;
  try {
    var result = await videos.createVideo(video);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(result);
}

async function deleteVideo(req: Request, res: Response) {
  const videoId = String(req.params.id);
  try {
    await videos.deleteVideo(videoId);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.status(204).send();
}

async function getVideos(req: Request, res: Response) {
  try {
    var result = await videos.getVideos();
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(result);
}

async function searchVideos(req: Request, res: Response) {
  const query = String(req.query.title);
  try {
    var result = await videos.searchVideos(query);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(result);
}

async function changeVideo(req: Request, res: Response) {
  const videoId = String(req.params.id);
  const video = req.body;
  try {
    var result = await videos.updateVideo(videoId, video);
  } catch (error: any) {
    sendErrorResponse(error, req, res);
    return;
  }
  res.json(result);
}


module.exports = {
  changeVideo: [apiKeyValidator, changeVideo],
  createVideo: [apiKeyValidator, createVideo],
  deleteVideo: [apiKeyValidator, deleteVideo],
  getVideos: [apiKeyValidator, getVideos],
  searchVideos
};
