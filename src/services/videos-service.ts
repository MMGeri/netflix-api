type VideoType = "Movie" | "TV Show";

interface Video {
  id: number;
  title: string;
  category: string;
  type: VideoType;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewVideo = Omit<Video, "id">

let videosData: Video[] = [
  {
    id: 1,
    title: 'The Matrix',
    category: 'Action',
    type: 'Movie'
  },
  {
    id: 2,
    title: 'Titanic',
    category: 'Romance',
    type: 'Movie'
  },
  {
    id: 3,
    title: 'Breakig bad',
    category: 'Thriller',
    type: 'TV Show'
  }
];

let lastId = 3
function getNextId(): number {
  return ++lastId;
}

interface VideoRepositoryService {
  findVideoById: (id: number) => Promise<Video | undefined>;
  createVideo: (video: NewVideo) => Promise<boolean>;
  deleteVideo: (id: number) => Promise<boolean>;
  updateVideo: (videoId:number,video: NewVideo) => Promise<Video | undefined>;
  getVideos: () => Promise<Video[]>;
  searchVideos: (query: string) => Promise<Video[]>;
}

let videoRepositoryService: VideoRepositoryService = {
  getVideos: async function (): Promise<Video[]> {
    return videosData;
  },
  searchVideos: async function (query: string): Promise<Video[]> {
    const videos = videosData.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
    return videos;
  },
  findVideoById: async function (id: number): Promise<Video | undefined> {
    const video = videosData.filter(video => video.id === id).at(0);
    return video;
  },
  createVideo: async function (newVideo: NewVideo) {
    const newId = getNextId();
    videosData.push({ id: newId, ...newVideo })
    return true;
  },
  deleteVideo: async function (id: number): Promise<boolean> {
    const indexOfVideo = videosData.findIndex(video => video.id == id)
    if (indexOfVideo <= -1) return false;
    videosData.splice(indexOfVideo, 1);
    return true;
  },
  updateVideo: async function (videoId:number,videoUpdate: NewVideo): Promise<Video | undefined> {
    const indexOfVideo = videosData.findIndex(video => video.id == videoId)
    if (indexOfVideo != -1) {
      videosData[indexOfVideo] = { ...videosData[indexOfVideo], ...videoUpdate };
      return videosData[indexOfVideo]
    }
  }
}



export default videoRepositoryService
export { Video, NewVideo }

