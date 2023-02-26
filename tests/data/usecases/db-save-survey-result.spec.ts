import MockDate from "mockdate";
import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository,
} from "@/tests/data/mocks";
import {
  mockFakeSurveyResultParams,
  mockSurveyResultModel,
} from "@/tests/domain/mocks";
import { DbSaveSurveyResult } from "@/data/usecases";
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from "@/data/protocols";

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  );
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
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

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockRejectedValueOnce(new Error());

    const promise = sut.save(surveyResultData);

    expect(promise).rejects.toThrow();
  });

  it("should call LoadSurveyResultRepository with correct values", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();
    const loadBySurveySpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      "loadBySurveyId"
    );

    await sut.save(surveyResultData);

    expect(loadBySurveySpy).toHaveBeenCalledWith(
      surveyResultData.surveyId,
      surveyResultData.accountId
    );
  });

  it("should throw if LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockRejectedValueOnce(new Error());

    const promise = sut.save(surveyResultData);

    expect(promise).rejects.toThrow();
  });

  it("should return SurveyResult on success", async () => {
    const { sut } = makeSut();
    const surveyResultData = mockFakeSurveyResultParams();

    const surveyResult = await sut.save(surveyResultData);

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
