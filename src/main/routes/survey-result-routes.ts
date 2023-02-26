import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { auth } from "@/main/middlewares/auth";
import {
  makeLoadSurveyResultController,
  makeSaveSurveyResultController,
} from "@/main/factories/controllers";

export default (router: Router): void => {
  router.put(
    "/surveys/:surveyId/results",
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
  router.get(
    "/surveys/:surveyId/results",
    auth,
    adaptRoute(makeLoadSurveyResultController())
  );
};
