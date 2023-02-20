import { AddSurvey, AddSurveyParams } from "@/domain/usecases/add-survey";
import { LoadSurveys } from "@/domain/usecases/load-surveys";
import { SurveyModel } from "@/domain/models/survey";
import { mockSurveyModels } from "@/domain/test";

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add(data: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  const addSurveyStub = new AddSurveyStub();
  return addSurveyStub;
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }
  return new LoadSurveysStub();
};
