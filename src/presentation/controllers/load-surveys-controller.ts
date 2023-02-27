import { LoadSurveys } from "@/domain/usecases";
import {
  noContent,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { Controller, HttpResponse } from "@/presentation/protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId);
      return surveys.length > 0 ? ok(surveys) : noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string;
  };
}
