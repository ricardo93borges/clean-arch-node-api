import { LoadAnswersBySurvey } from "@/domain/usecases/load-answers-by-survey";
import { LoadAnswersBySurveyRepository } from "@/data/protocols";

export class DbLoadAnswersSurvey implements LoadAnswersBySurvey {
  constructor(
    private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
  ) {}

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    return this.loadAnswersBySurveyRepository.loadAnswers(id);
  }
}
