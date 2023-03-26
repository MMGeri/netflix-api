import { Video } from "../api/services/video-repository";
import { User } from "../api/services/user-repository";

function validateUserData(newUser: User): boolean {
    throw new Error("Function not implemented.");
}

function validateVideoData(newVideo: Video): boolean {
    throw new Error("Function not implemented.");
}

export {validateUserData, validateVideoData}