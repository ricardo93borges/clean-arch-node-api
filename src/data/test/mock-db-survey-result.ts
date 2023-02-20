import { mockSurveyResultModel } from "@/domain/test";
import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {
  SaveSurveyResultParams,
  SurveyResultModel,
} from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(
        surveyResultData: SaveSurveyResultParams
      ): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResultModel());
      }
    }

    return new SaveSurveyResultRepositoryStub();
  };
