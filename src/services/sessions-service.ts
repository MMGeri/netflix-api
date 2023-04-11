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
      return Promise.reject({
        code: 404,
        message: "Session Not Found"
      })
    }
    return Promise.reject({
      code: 500,
      message: "There was an internal server error while processing your request, please try again later"
    })
  }
);


type Session = {
  user: User;
}

interface SessionRepositoryService {
  findSessionById: (sessionId: string) => Promise<Session>;
  createSession: (session: Session) => Promise<string>;
  deleteSession: (sessionId: string) => Promise<void>;
}

let sessionRepositoryService: SessionRepositoryService = {
  findSessionById: async (sessionId: string) => {
    return await api.get(`${apiUrl}/${sessionId}?populate=user`).then(response => response.data);
  },
  createSession: async (session: Session) => {;
    return await api.post(`${apiUrl}`,{user:session.user.id}).then(response => response.data.id);
  },
  deleteSession: async (sessionId: string) => {
    await api.delete(`${apiUrl}/${sessionId}`);
  },
}

export default sessionRepositoryService;

