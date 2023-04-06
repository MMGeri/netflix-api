require('dotenv').config();
import axios from "axios";

const apiUrl = `${process.env.DB_API_URL}/videos`;

type VideoType = "Movie" | "TV Show";

interface Video {
  id: string;
  title: string;
  category: string;
  type: VideoType;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewVideo = Omit<Video, "id">

interface VideoRepositoryService {
  findVideoById: (id: string) => Promise<Video | undefined>;
  createVideo: (video: NewVideo) => Promise<boolean>;
  deleteVideo: (id: string) => Promise<boolean>;
  updateVideo: (videoId:string,video: NewVideo) => Promise<Video | undefined>;
  getVideos: () => Promise<Video[]>;
  searchVideos: (query: string) => Promise<Video[]>;
}

let videoRepositoryService: VideoRepositoryService = {
  getVideos: async function (): Promise<Video[]> {
    const videosData = await axios.get(apiUrl).then(response => response.data);
    return videosData;
  },
  searchVideos: async function (query: string): Promise<Video[]> {
    const videos = await axios.get(`${apiUrl}?query={"title":{"$regex":"${query}"}}`).then(response => response.data);
    return videos;
  },
  findVideoById: async function (id: string): Promise<Video | undefined> {
    const video = await axios.get(`${apiUrl}/${id}`).then(response => response.data);
    return video;
  },
  createVideo: async function (newVideo: NewVideo) {
    await axios.post(apiUrl, newVideo);
    return true;
  },
  deleteVideo: async function (id: string): Promise<boolean> {
    return await axios.delete(`${apiUrl}/${id}`);
  },
  updateVideo: async function (videoId:string,videoUpdate: NewVideo): Promise<Video | undefined> {
    return await axios.put(`${apiUrl}/${videoId}`, videoUpdate).then(response => response.data);
  }
}



export default videoRepositoryService
export { Video, NewVideo }

