import { validateVideoData } from "../../utils/validateData";

type VideoType = "Movie" | "TV Show";

interface Video {
    id?: string;
    title: string;
    category: string;
    type: VideoType;
  }
  
  let videosData: Video[] = [
    {
      id: 'TQIXQKT0OO',
      title: 'The Matrix',
      category: 'Action',
      type: 'Movie'
    },
    {
      id: 'F6P4DNAMCF',
      title: 'Titanic',
      category: 'Romance',
      type: 'Movie'
    },
    {
      id: 'XPNJWT9O59',
      title: 'Breakig bad',
      category: 'Thriller',
      type: 'TV Show'
    }
  ];


  interface VideoRepositoryService {
    findVideoById: (id: string) => Promise<Video | undefined>;
    createVideo: (video: Video) => Promise<boolean>;
    deleteVideo: (video: Video) => Promise<boolean>;
    updateVideo: (video: Video) => Promise<Video | undefined>;
  }
  
  let videoRepositoryService: VideoRepositoryService = {
    findVideoById: async function (id: string): Promise<Video | undefined> {
      const video = videosData.filter(video => video.id === id).at(0);
      return video;
    },
    createVideo: async function (newVideo: Video) {
      const videoInData = videosData.filter(video => video.id === newVideo.id);
      if (validateVideoData(newVideo) && !videoInData){
        videosData.push(newVideo)
        return true;
      }
      return false;
    },
    deleteVideo: async function (videoToBeDeleted: Video): Promise<boolean> {
      const indexOfVideo = videosData.findIndex(video => video.id == videoToBeDeleted.id)
      if (indexOfVideo <= -1) return false;
      videosData.splice(indexOfVideo, 1);
      return true;
    },
    updateVideo: async function (videoUpdate: Video): Promise<Video | undefined> {
      const indexOfVideo = videosData.findIndex(video => video.id == videoUpdate.id)
      if (validateVideoData(videoUpdate) && indexOfVideo != -1) {
        videosData[indexOfVideo] = { ...videosData[indexOfVideo], ...videoUpdate };
        return videosData[indexOfVideo]
      }
    }
  }

  export default videoRepositoryService
export { Video }