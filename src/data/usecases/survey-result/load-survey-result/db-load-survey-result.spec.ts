import MockDate from "mockdate";
import { DbLoadSurveyResult } from "./db-load-survey-result";
import { LoadSurveyResultRepository } from "./db-load-survey-result-protocols";
import { mockLoadSurveyResultRepository } from "@/data/test";
import { mockSurveyResultModel } from "@/domain/test";

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub };
};

describe("DbLoadSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyResultRepository with correct values", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyId = "surveyId";
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      "loadBySurveyId"
    );

    await sut.load(surveyId);

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId);
  });

  it("should throw if LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyId = "surveyId";
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockRejectedValueOnce(new Error());

    const promise = sut.load(surveyId);

    expect(promise).rejects.toThrow();
  });

  it("should return SurveyResultModel on success", async () => {
    const { sut } = makeSut();
    const surveyId = "surveyId";

    const surveyResult = await sut.load(surveyId);

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
