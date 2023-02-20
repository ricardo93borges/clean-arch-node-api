import MockDate from "mockdate";
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from "./db-save-survey-result-protocols";
import { DbSaveSurveyResult } from "./db-save-survey-result";

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "id",
  surveyId: "surveyId",
  accountId: "accountId",
  answer: "answer",
  date: new Date(),
});

const makeFakeSurveyResultData = (): SaveSurveyResultParams => {
  const { id, ...rest } = makeFakeSurveyResult();
  return rest;
};

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(
      surveyResultData: SaveSurveyResultParams
    ): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
};

describe("DbSaveSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = makeFakeSurveyResultData();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  it("should return a survey on success", async () => {
    const { sut } = makeSut();
    const surveyResultData = makeFakeSurveyResultData();

    const survey = await sut.save(surveyResultData);

    expect(survey).toEqual(makeFakeSurveyResult());
  });

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = makeFakeSurveyResultData();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockRejectedValueOnce(new Error());

    const promise = sut.save(surveyResultData);

    expect(promise).rejects.toThrow();
  });
});
