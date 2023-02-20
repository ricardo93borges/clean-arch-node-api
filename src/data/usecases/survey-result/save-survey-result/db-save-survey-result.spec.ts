import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import { mockSaveSurveyResultRepository } from "@/data/test";
import {
  mockSurveyResultModel,
  mockFakeSurveyResultParams,
} from "@/domain/test";

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
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
    const surveyResultData = mockFakeSurveyResultParams();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  it("should return a survey on success", async () => {
    const { sut } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();

    const survey = await sut.save(surveyResultData);

    expect(survey).toEqual(mockSurveyResultModel());
  });

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockRejectedValueOnce(new Error());

    const promise = sut.save(surveyResultData);

    expect(promise).rejects.toThrow();
  });
});
