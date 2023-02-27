import { NextFunction, Request, Response } from "express";
import { Middleware } from "@/presentation/protocols";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.["x-access-token"],
      ...(req.headers || {}),
    };

    const { statusCode, body } = await middleware.handle(request);

    if (statusCode === 200) {
      Object.assign(req, body);
      next();
    } else {
      res.status(statusCode).json({
        error: body.message,
      });
    }
  };
};
