import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { CheckSurveyById, LoadSurveyResult } from "@/domain/usecases";

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyResult: LoadSurveyResult,
    private readonly checkSurveyById: CheckSurveyById
  ) {}

  async handle(
    request: LoadSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request;

      const exists = await this.checkSurveyById.checkById(surveyId);

      if (!exists) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        accountId
      );

      return ok(surveyResult);
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  };
}
