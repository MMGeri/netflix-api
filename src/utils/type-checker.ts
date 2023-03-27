import { User } from "../services/users-service";
import { Video } from "../services/video-service";

function isVideo(obj: any): obj is Video {
    if (obj?.id && obj?.category && obj?.type && obj?.title)
        return true
    return false;
}
function isUser(obj: any): obj is User {
    if (obj?.id && obj?.email && obj?.password)
        return true
    return false;
}

function isError(obj: any): obj is Error {
    if (obj?.code && obj?.message)
        return true
    return false;
}

export { isUser, isVideo, isError }