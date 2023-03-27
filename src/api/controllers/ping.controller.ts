import { Request, Response } from 'express';

module.exports = {
  ping: (req: Request, res: Response) => res.status(200).send('pong'),
};
