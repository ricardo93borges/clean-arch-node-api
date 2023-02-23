import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "@/domain/usecases/save-survey-result";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { SurveyModel } from "@/domain/models/survey";
import { mockSurveyModel, mockSurveyResultModel } from "@/domain/test";
import { SurveyResultModel } from "@/domain/models/survey-result";

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveysByIdStub implements LoadSurveyById {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveysByIdStub();
};
