import { LoadSurveyResultController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeDbLoadSurveyResult } from "@/main/factories/usecases";
import { makeDbLoadSurveyById } from "@/main/factories/usecases/load-surveys-by-id-factory";
import { makeLogControllerDecorator } from "@/main/factories/decorators";

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyResult(),
    makeDbLoadSurveyById()
  );
  return makeLogControllerDecorator(controller);
};
