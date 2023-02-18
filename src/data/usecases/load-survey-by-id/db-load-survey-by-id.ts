import {
  LoadSurveyByIdRepository,
  LoadSurveysById,
  SurveyModel,
} from "./db-load-survey-by-id-protocols";

export class DbLoadSurveyById implements LoadSurveysById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
