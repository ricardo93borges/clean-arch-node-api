import {
  forbidden,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { SaveSurveyResult } from "@/domain/usecases";
import { LoadAnswersBySurvey } from "@/domain/usecases/";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { accountId, answer, surveyId } = request;

      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);

      if (!answers.length) {
        return forbidden(new InvalidParamError("surveyId"));
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError("answer"));
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
