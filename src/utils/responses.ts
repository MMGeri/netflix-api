import { Request, Response } from "express";

function sendErrorResponse ( error: any, req: Request, res: Response) {
    res.status(error.code || 500).json({code: error.code || 500, message: error.message || 'Internal Server Error'});
}

export {sendErrorResponse}