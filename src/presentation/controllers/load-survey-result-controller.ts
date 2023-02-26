import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";
import { LoadSurveyResult } from "@/domain/usecases";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyResult: LoadSurveyResult,
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const { surveyId } = httpRequest.params;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
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
