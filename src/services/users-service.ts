import axios from "axios";
import { Video } from "./videos-service";
require("dotenv").config();

const apiUrl = `${process.env.DB_API}/users`;

type User = {
  id: string;
  username: string;
  password: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type NewUser = Omit<User, "id">

interface UserRepositoryService {
  findUserByUsername: (username: string) => Promise<User | undefined>;
  createUser: (user: NewUser) => Promise<User | undefined>;
  
  getQueueByUsername: (username: string, sortBy:string) => Promise<Video[] | []>;
  removeVideoFromQueue: (userId: string, videoId: string) => Promise<Video[] | []>;
  queueVideo: (username: string, videoId: string) => Promise<Video[] | []>;
}

let userRepositoryService: UserRepositoryService = {
  findUserByUsername: async function (username: string): Promise<User> {
    return await axios.get(`${apiUrl}?query={"username":"${username}"}`).then(response => {
     if(response?.data.length === 0) return undefined
     if(response?.data.length > 1){
      console.error("More than one user with the same username", response.data)
      throw {code: 500, message:"More than one user with the same username"};
     }
     return response?.data[0]
    }) 
  },

  createUser: async function (newUser: NewUser) {
    return await axios.post(apiUrl, newUser).then(response => response?.data)
  },
  
  removeVideoFromQueue: async function (username: string, videoId: string) {
    return await axios.delete(`${apiUrl}/${username}/queue/${videoId}`).then(response => response?.data);
  },
  queueVideo: async function (username: string, videoId: string) {
    return await axios.put(`${apiUrl}/${username}/queue/${videoId}`).then(response => response?.data); 
  },

  getQueueByUsername: async function (username: string,sortBy:string) {
    return await axios.get(`${apiUrl}/${username}/queue?sort=${sortBy}`).then(response => response?.data); 
  }
}

export default userRepositoryService
export { User, NewUser }

