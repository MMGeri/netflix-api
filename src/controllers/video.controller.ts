import { Request, Response } from 'express';
import videosService from '../services/videos-service';

async function createVideo(req: Request, res: Response, next: any) {
  try {
    const video = req.body;
    const result = await videosService.createVideo(video);
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
}

async function deleteVideo(req: Request, res: Response, next: any) {
  try {
    const videoId = String(req.params.id);
    await videosService.deleteVideo(videoId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getVideos(req: Request, res: Response, next: any) {
  try {
    const result = await videosService.getVideos();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function searchVideos(req: Request, res: Response, next: any) {
  try {
    const query = String(req.query.title);
    const result = await videosService.searchVideos(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function changeVideo(req: Request, res: Response, next: any) {
  try {
    const videoId = String(req.params.id);
    const video = req.body;
    const result = await videosService.updateVideo(videoId, video);
    if (!result) {
      res.status(404).json({ code: 404, message: 'Video not found' });
      return;
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
}

module.exports = {
  changeVideo: [changeVideo],
  createVideo: [createVideo],
  deleteVideo: [deleteVideo],
  getVideos: [getVideos],
  searchVideos: [searchVideos]
};
