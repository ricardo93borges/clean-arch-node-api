import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { LoadSurveyByIdRepository } from "@/data/protocols";
import { SurveyModel } from "@/domain/models";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}