import { Video } from "./videos-service";
import videoService from "./videos-service";

type User = {
  id: string;
  email: string;
  password: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewUser = Omit<User, "id">

let queueData = [
  {
    userId: '1',
    videoId: '1'
  },
  {
    userId: '1',
    videoId: '2'
  },
]

let usersData: User[] = [
  {
    id: '1',
    email: 'example@example.com',
    password: 'password'
  },
  {
    id: '2',
    email: 'example2@example.com',
    password: 'password2'
  }
];



interface UserRepositoryService {
  findUserById: (userId: string) => Promise<User | undefined>;
  createUser: (user: NewUser) => Promise<User>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, user: NewUser) => Promise<User | undefined>;

  getQueueByUserId: (userId: string) => Promise<Video[] | []>;
  removeVideoFromQueue: (userId: string, videoId: string) => Promise<Video[] | []>;
  queueVideo: (userId: string, videoId: string) => Promise<Video[] | []>;
}

let userRepositoryService: UserRepositoryService = {
  findUserById: async function (id: string): Promise<User | undefined> {
    const user = usersData.filter(user => user.id === id).at(0);
    return user;
  },

  createUser: async function (newUser: NewUser) {
    const newId = "asd"; //FIXME:
    const user = { id: newId, ...newUser };
    usersData.push(user)
    return user;
  },

  deleteUser: async function (id: string) {
    const indexOfUser = usersData.findIndex(user => user.id == id)
    if (indexOfUser <= -1) return false;
    usersData.splice(indexOfUser, 1);
    return true;
  },

  updateUser: async function (userId: string, userUpdate: NewUser) {
    const indexOfUser = usersData.findIndex(user => user.id == userId)
    if (indexOfUser != -1) {
      usersData[indexOfUser] = { ...usersData[indexOfUser], ...userUpdate };
      return usersData[indexOfUser]
    }
  },
  removeVideoFromQueue: async function (userId: string, videoId: string) {
    queueData = queueData.filter(queue => queue.userId !== userId && queue.videoId !== videoId);
    const queuedVideos = await this.getQueueByUserId(userId);
    return queuedVideos;
  },
  queueVideo: async function (userId: string, videoId: string) {
    queueData.push({ userId, videoId });
    const queuedVideos = await this.getQueueByUserId(userId);
    return queuedVideos;
  },

  getQueueByUserId: async function (id: string) {
    const user = await this.findUserById(id);
    if (!user) return [];
    const queue = queueData.filter(queue => queue.userId === user.id);
    const videos = await Promise.all(queue.map(async queue => await videoService.findVideoById(queue.videoId)));
    return videos as Video[];
  }
}



export default userRepositoryService
export { User, NewUser }

