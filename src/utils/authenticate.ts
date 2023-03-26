import { Request, Response } from "express";

function isUserLoggedIn( sessionId:string, userId?: number) {
    const session = globalThis.sessions.get(sessionId);
    if (!session || (session.user.id != userId && userId)) {
      return false;
    }
    return true;
  }

let adminApiKey = '1234';

function isApiKey(apiKey:string) {
    return apiKey === adminApiKey;
}

  export { isUserLoggedIn, isApiKey}

