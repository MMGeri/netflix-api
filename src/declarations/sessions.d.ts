import { User } from "../services/users-service";

declare global{
    var sessions: Map<string, {user:User}>;
} 
