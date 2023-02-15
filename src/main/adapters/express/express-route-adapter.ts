import { Request, Response } from "express";
import { Controller, HttpRequest } from "../../../presentation/protocols";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const { statusCode, body } = await controller.handle(httpRequest);

    if (statusCode >= 200 || statusCode <= 299) {
      res.status(statusCode).json(body);
    } else {
      res.status(statusCode).json({
        error: body.message,
      });
    }
  };
};
