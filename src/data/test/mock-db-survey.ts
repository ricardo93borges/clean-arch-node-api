import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyParams } from "@/data/usecases/survey/add-survey/db-add-survey-protocols";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyModel } from "@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { mockSurveyModel, mockSurveyModels } from "@/domain/test";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }

  return new LoadSurveysRepositoryStub();
};
