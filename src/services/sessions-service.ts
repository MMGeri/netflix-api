import { User } from "./users-service";

let sessions: Map<string, Session> = new Map<string, Session>();

type Session = {
  user: User;
}

interface SessionRepositoryService {
  findSessionById: (sessionId: string) => Promise<Session | undefined>;
  createSession: (session: Session) => Promise<string>;
  deleteSession: (sessionId: string) => Promise<boolean>;
}

let sessionRepositoryService: SessionRepositoryService = {
  findSessionById: async (sessionId: string) => {
    return sessions.get(sessionId);
  },
  createSession: async (session: Session) => {
    const sessionId = createSessionId(32);
    sessions.set(sessionId, session);
    return sessionId;
  },
  deleteSession: async (sessionId: string) => {
    return sessions.delete(sessionId);
  },
}

function createSessionId(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default sessionRepositoryService;

