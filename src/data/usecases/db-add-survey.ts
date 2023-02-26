import { AddSurvey, AddSurveyParams } from "@/domain/usecases/add-survey";
import { AddSurveyRepository } from "@/data/protocols";

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
