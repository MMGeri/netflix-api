require("dotenv").config();
import axios from "axios";
import { User } from "./users-service";

const apiUrl = `${process.env.DB_API_URL}/sessions`;




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
    return await axios.get(`${apiUrl}/${sessionId}?populate=user`).then(response => response?.data);
  },
  createSession: async (user: User) => {;
    return await axios.post(`${apiUrl}`,{user}).then(response => response?.data);
  },
  deleteSession: async (sessionId: string) => {
    await axios.delete(`${apiUrl}/${sessionId}`);
  },
}

export default sessionRepositoryService;

