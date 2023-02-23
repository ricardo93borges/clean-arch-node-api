import {
  forbidden,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
  Validation,
} from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const { answer } = httpRequest.body;
      const { surveyId } = httpRequest.params;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (survey) {
        const answers = survey.answers.map((a) => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError("answer"));
        }
      } else {
        return forbidden(new InvalidParamError("surveyId"));
      }

      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });

      return noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}
