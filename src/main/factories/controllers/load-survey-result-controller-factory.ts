import { LoadSurveyResultController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import {
  makeDbCheckSurveyById,
  makeDbLoadSurveyResult,
} from "@/main/factories/usecases";
import { makeLogControllerDecorator } from "@/main/factories/decorators";

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyResult(),
    makeDbCheckSurveyById()
  );
  return makeLogControllerDecorator(controller);
};
