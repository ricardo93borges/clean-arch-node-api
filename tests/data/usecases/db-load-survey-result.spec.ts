import MockDate from "mockdate";
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository,
} from "@/tests/data/mocks";
import { mockSurveyResultModel } from "@/tests/domain/mocks";
import { DbLoadSurveyResult } from "@/data/usecases";
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository,
} from "@/data/protocols";

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();

  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  );
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
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
    const accountId = "accountId";
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      "loadBySurveyId"
    );

    await sut.load(surveyId, accountId);

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId, accountId);
  });

  it("should throw if LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyId = "surveyId";
    const accountId = "accountId";

    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockRejectedValueOnce(new Error());

    const promise = sut.load(surveyId, accountId);

    expect(promise).rejects.toThrow();
  });

  it("should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null", async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();
    const surveyId = "surveyId";
    const accountId = "accountId";
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockResolvedValueOnce(null);
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");

    await sut.load(surveyId, accountId);

    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId);
  });

  it("should return SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const surveyId = "surveyId";
    const accountId = "accountId";
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockResolvedValueOnce(null);

    const surveyResult = await sut.load(surveyId, accountId);

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });

  it("should return SurveyResultModel on success", async () => {
    const { sut } = makeSut();
    const surveyId = "surveyId";
    const accountId = "accountId";

    const surveyResult = await sut.load(surveyId, accountId);

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
