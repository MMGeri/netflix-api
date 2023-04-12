require("dotenv").config();
import axios from "axios";
import { User } from "./users-service";

const apiUrl = `${process.env.DB_API_URL}/sessions`;
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


type Session = {
  id: string;
  user: User;
}

interface SessionRepositoryService {
  findSessionById: (sessionId: string) => Promise<Session | undefined>;
  createSession: (user: User) => Promise<Session>;
  deleteSession: (sessionId: string) => Promise<void>;
}

let sessionRepositoryService: SessionRepositoryService = {
  findSessionById: async (sessionId: string) => {
    return await api.get(`${apiUrl}/${sessionId}?populate=user`).then(response => response?.data);
  },
  createSession: async (user: User) => {;
    return await api.post(`${apiUrl}`,{user}).then(response => response?.data);
  },
  deleteSession: async (sessionId: string) => {
    await api.delete(`${apiUrl}/${sessionId}`);
  },
}

export default sessionRepositoryService;

