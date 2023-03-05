import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../decorators/log-controller-decorator-factory";
import { SaveSurveyResultController } from "@/presentation/controllers";
import {
  makeDbSaveSurveyResult,
  makeDbLoadAnswersBySurvey,
} from "@/main/factories/usecases";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbSaveSurveyResult(),
    makeDbLoadAnswersBySurvey()
  );
  return makeLogControllerDecorator(controller);
};
