import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "@/domain/usecases/save-survey-result";
import { LoadAnswersBySurvey } from "@/domain/usecases/load-answers-by-survey";
import { SurveyModel } from "@/domain/models/survey";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { LoadSurveyResult } from "@/domain/usecases/load-survey-result";
import { mockSurveyModel, mockSurveyResultModel } from "@/tests/domain/mocks";
import { CheckSurveyById } from "@/domain/usecases";

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

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
      const survey = mockSurveyModel();
      const answers = survey.answers.map((a) => a.answer);
      return Promise.resolve(answers);
    }
  }

  return new LoadAnswersBySurveyStub();
};

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    checkById(id: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new CheckSurveyByIdStub();
};
