import { Controller } from "@/presentation/protocols";
import { makeDbLoadSurveys } from "@/main/factories/usecases";
import { makeLogControllerDecorator } from "@/main/factories/decorators";
import { LoadSurveysController } from "@/presentation/controllers";

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
