import {
  badRequest,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { Controller, HttpResponse, Validation } from "@/presentation/protocols";
import { AddSurvey } from "@/domain/usecases";

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const { question, answers } = request;
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      await this.addSurvey.add({ question, answers, date: new Date() });

      return noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace AddSurveyController {
  export type Request = {
    question: string;
    answers: Answer[];
  };

  type Answer = {
    image?: string;
    answer: string;
  };
}
