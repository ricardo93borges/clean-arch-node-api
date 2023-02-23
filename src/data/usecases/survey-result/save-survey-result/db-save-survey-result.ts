import {
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
} from "./db-save-survey-result-protocols";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultParams): Promise<void> {
    await this.saveSurveyResultRepository.save(data);
  }
}
