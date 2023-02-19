import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { makeDbLoadSurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-surveys-by-id";
import { makeDbSaveSurveyResult } from "@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbSaveSurveyResult(),
    makeDbLoadSurveyById()
  );
  return makeLogControllerDecorator(controller);
};
