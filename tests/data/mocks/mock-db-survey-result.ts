import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { mockSurveyResultModel } from "@/tests/domain/mocks";
import { SaveSurveyResultParams } from "@/domain/usecases";
import { SurveyResultModel } from "@/domain/models";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(surveyResultData: SaveSurveyResultParams): Promise<void> {
        return Promise.resolve();
      }
    }

    return new SaveSurveyResultRepositoryStub();
  };

export const mockLoadSurveyResultRepository =
  (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResultModel());
      }
    }

    return new LoadSurveyResultRepositoryStub();
  };
