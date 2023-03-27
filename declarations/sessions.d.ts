import { User } from "../src/services/users-service";
declare global{
    var sessions: Map<string, {user:User}>;
} 
export interface global {sessions: Map<string, {user:User}>}
