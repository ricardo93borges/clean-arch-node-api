import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "@/domain/usecases/save-survey-result";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { SurveyModel } from "@/domain/models/survey";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { LoadSurveyResult } from "@/domain/usecases/load-survey-result";
import { mockSurveyModel, mockSurveyResultModel } from "@/tests/domain/mocks";

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }

  return new LoadSurveyResultStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveysByIdStub implements LoadSurveyById {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveysByIdStub();
};
