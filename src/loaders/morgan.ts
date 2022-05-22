import { Request, Response } from "express";
import { TokenIndexer } from "morgan";
import { Logger } from "../libs";

export default function morganConfigWithLogger(tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent');
  return Logger.info(`📍 ${[
    tokens.method(req, res),
    "-",
    ip,
    "-",
    tokens.url(req, res),
    "-",
    tokens.status(req, res),
    "-",
    tokens.res(req, res, 'content-length'), 
    userAgent,
    '-',
    tokens['response-time'](req, res), 
    'ms',
  ].join(' ')}`)
}