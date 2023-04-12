require("dotenv").config();
import axios from "axios";
import { Video } from "./videos-service";

const apiUrl = `${process.env.DB_API_URL}/users`;
const api = axios.create({
  baseURL: apiUrl
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 404) {
      return Promise.resolve(undefined)
    }
    console.error(error);
    return Promise.reject({
      code: 500,
      message: "There was an internal server error while processing your request, please try again later"
    })
  }
);

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
    return await api.get(`${apiUrl}/${id}`).then(response => response?.data)
  },

  createUser: async function (newUser: NewUser) {
    return await api.post(apiUrl, newUser).then(response => response?.data)
  },

  deleteUser: async function (id: string) {
    await api.delete(`${apiUrl}/${id}`);
  },

  updateUser: async function (userId: string, userUpdate: NewUser) {
    return await api.put(`${apiUrl}/${userId}`, userUpdate).then(response => response?.data)
  },
  
  removeVideoFromQueue: async function (userId: string, videoId: string) {
    return await api.delete(`${apiUrl}/${userId}/queue/${videoId}`).then(response => response?.data);
  },
  queueVideo: async function (userId: string, videoId: string) {
    return await api.put(`${apiUrl}/${userId}/queue/${videoId}`).then(response => response?.data);
  },

  getQueueByUserId: async function (id: string) {
    return await api.get(`${apiUrl}/${id}/queue`).then(response => response?.data);
  }
}

export default userRepositoryService
export { User, NewUser }

