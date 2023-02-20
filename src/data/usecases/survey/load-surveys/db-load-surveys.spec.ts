import MockDate from "mockdate";
import { DbLoadSurveys } from "./db-load-surveys";
import { LoadSurveysRepository } from "./db-load-surveys-protocols";
import { mockLoadSurveysRepository } from "@/data/test";
import { mockSurveyModels } from "@/domain/test";

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return { sut, loadSurveysRepositoryStub };
};

describe("DbLoadSurveys Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll");
    await sut.load();

    expect(loadSpy).toHaveBeenCalled();
  });

  it("should return a list of surveys on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(mockSurveyModels());
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockRejectedValueOnce(new Error());

    const promise = sut.load();

    expect(promise).rejects.toThrow();
  });
});
