import userService from "./users-service";
import videoService from "./videos-service";

import { Video } from "./videos-service";


let queueData = [
    {
        userId: 1,
        videoId: 1
    },
    {
        userId: 1,
        videoId: 2
    },
]

interface QueueRepositoryService {
    getQueueByUserId: (userId: number) => Promise<Video[] | []>;
    removeVideoFromQueue: (userId: number, videoId: number) => Promise<Video[] | []>;
    queueVideo: (userId: number, videoId: number) => Promise<Video[] | []>;
}

let queueRepositoryService: QueueRepositoryService = {
    removeVideoFromQueue: async function (userId: number, videoId: number) {
        queueData = queueData.filter(queue => queue.userId !== userId && queue.videoId !== videoId);
        const queuedVideos = await this.getQueueByUserId(userId);
        return queuedVideos;
    },
    queueVideo: async function (userId: number, videoId: number) {
        queueData.push({ userId, videoId });
        const queuedVideos = await this.getQueueByUserId(userId);
        return queuedVideos;
    },

    getQueueByUserId: async function (id: number) {
        const user = await userService.findUserById(id);
        if (!user) return [];
        const queue = queueData.filter(queue => queue.userId === user.id);
        const videos = await Promise.all(queue.map(async queue => await videoService.findVideoById(queue.videoId)));
        return videos as Video[];
    },
}

export default queueRepositoryService;