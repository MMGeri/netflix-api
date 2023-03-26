import { Video } from "../services/video-repository";
import { User } from "../services/user-repository";

function validateUserData(newUser: User): boolean {
    throw new Error("Function not implemented.");
}

function validateVideoData(newVideo: Video): boolean {
    throw new Error("Function not implemented.");
}

export {validateUserData, validateVideoData}