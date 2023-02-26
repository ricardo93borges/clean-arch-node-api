import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../decorators/log-controller-decorator-factory";
import { SaveSurveyResultController } from "@/presentation/controllers";
import { makeDbSaveSurveyResult } from "@/main/factories/usecases";
import { makeDbLoadSurveyById } from "@/main/factories/usecases/load-surveys-by-id-factory";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbSaveSurveyResult(),
    makeDbLoadSurveyById()
  );
  return makeLogControllerDecorator(controller);
};
