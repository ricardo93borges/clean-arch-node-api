import {
  LoadAnswersBySurvey,
  LoadSurveyResult,
  CheckSurveyById,
  SaveSurveyResult,
} from "@/domain/usecases";
import { mockSurveyModel, mockSurveyResultModel } from "@/tests/domain/mocks";

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    load(
      surveyId: string,
      accountId: string
    ): Promise<LoadSurveyResult.Result> {
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
