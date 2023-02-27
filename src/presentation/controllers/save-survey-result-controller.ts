import {
  forbidden,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { SaveSurveyResult } from "@/domain/usecases";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { accountId, answer, surveyId } = request;

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

export namespace SaveSurveyResultController {
  export type Request = {
    accountId: string;
    answer: string;
    surveyId: string;
  };
}
