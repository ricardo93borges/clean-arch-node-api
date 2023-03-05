import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "@/domain/models";
import { mockSurveyModel, mockSurveyModels } from "@/tests/domain/mocks";
import {
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
} from "../protocols";

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyRepository.Params): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
      return Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadAnswersBySurveyRepository =
  (): LoadAnswersBySurveyRepository => {
    class LoadAnswersBySurveyRepositoryStub
      implements LoadAnswersBySurveyRepository
    {
      async loadAnswers(
        id: string
      ): Promise<LoadAnswersBySurveyRepository.Result> {
        const survey = mockSurveyModel();
        return Promise.resolve(survey.answers.map((a) => a.answer));
      }
    }

    return new LoadAnswersBySurveyRepositoryStub();
  };

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
      return Promise.resolve(true);
    }
  }

  return new CheckSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(accountId: string): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }

  return new LoadSurveysRepositoryStub();
};
