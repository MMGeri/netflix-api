require("dotenv").config();
import axios from "axios";

const apiUrl = `${process.env.DB_API_URL}/videos`;
const api = axios.create({
  baseURL: apiUrl
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 404) {
      return Promise.reject({
        code: 404,
        message: "Video Not Found"
      })
    }
    return Promise.reject({
      code: 500,
      message: "There was an internal server error while processing your request, please try again later"
    })
  }
);

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
  findVideoById: (id: string) => Promise<Video>;
  createVideo: (video: NewVideo) => Promise<Video >;
  deleteVideo: (id: string) => Promise<void>;
  updateVideo: (videoId: string, video: NewVideo) => Promise<Video>;
  getVideos: () => Promise<Video[]>;
  searchVideos: (query: string) => Promise<Video[]>;
}

let videoRepositoryService: VideoRepositoryService = {
  getVideos: async function (): Promise<Video[]> {
    return await api.get(apiUrl).then(response => response.data);
  },
  searchVideos: async function (query: string): Promise<Video[]> {
    return await api.get(`${apiUrl}?query={"title":{"$regex":"${query}"}}`).then(response => response.data);
  },
  findVideoById: async function (id: string): Promise<Video> {
    return await api.get(`${apiUrl}/${id}`).then(response => response.data);
  },
  createVideo: async function (newVideo: NewVideo) {
    return await api.post(apiUrl, newVideo).then(response => response.data);
  },
  deleteVideo: async function (id: string): Promise<void> {
    await api.delete(`${apiUrl}/${id}`)
  },
  updateVideo: async function (videoId: string, videoUpdate: NewVideo): Promise<Video> {
    return await api.put(`${apiUrl}/${videoId}`, videoUpdate).then(response => response.data)
  }
}



export default videoRepositoryService
export { Video, NewVideo }

