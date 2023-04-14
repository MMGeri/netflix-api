require("dotenv").config();
import axios from "axios";
import { Video } from "./videos-service";

const apiUrl = `${process.env.DB_API_URL}/users`;


type User = {
  id: string;
  email: string;
  password: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewUser = Omit<User, "id">

interface UserRepositoryService {
  findUserById: (userId: string) => Promise<User | undefined>;
  createUser: (user: NewUser) => Promise<User | undefined>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, user: NewUser) => Promise<User | undefined>;

  getQueueByUserId: (userId: string) => Promise<Video[] | []>;
  removeVideoFromQueue: (userId: string, videoId: string) => Promise<Video[] | []>;
  queueVideo: (userId: string, videoId: string) => Promise<Video[] | []>;
}

let userRepositoryService: UserRepositoryService = {
  findUserById: async function (id: string): Promise<User> {
    return await axios.get(`${apiUrl}/${id}`).then(response => response?.data)
  },

  createUser: async function (newUser: NewUser) {
    return await axios.post(apiUrl, newUser).then(response => response?.data)
  },

  deleteUser: async function (id: string) {
    await axios.delete(`${apiUrl}/${id}`);
  },

  updateUser: async function (userId: string, userUpdate: NewUser) {
    return await axios.put(`${apiUrl}/${userId}`, userUpdate).then(response => response?.data)
  },
  
  removeVideoFromQueue: async function (userId: string, videoId: string) {
    return await axios.delete(`${apiUrl}/${userId}/queue/${videoId}`).then(response => response?.data);
  },
  queueVideo: async function (userId: string, videoId: string) {
    return await axios.put(`${apiUrl}/${userId}/queue/${videoId}`).then(response => response?.data);
  },

  getQueueByUserId: async function (id: string) {
    return await axios.get(`${apiUrl}/${id}/queue`).then(response => response?.data);
  }
}

export default userRepositoryService
export { User, NewUser }

