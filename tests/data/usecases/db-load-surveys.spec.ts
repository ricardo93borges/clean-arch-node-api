import MockDate from "mockdate";
import { DbLoadSurveys } from "@/data/usecases/survey/load-surveys/db-load-surveys";
import { LoadSurveysRepository } from "@/data/usecases/survey/load-surveys/db-load-surveys-protocols";
import { mockLoadSurveysRepository } from "@/tests/data/mocks";
import { mockSurveyModels } from "@/tests/domain/mocks";

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
    const accountId = "accountId";
    await sut.load(accountId);

    expect(loadSpy).toHaveBeenCalledWith(accountId);
  });

  it("should return a list of surveys on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.load("accountId");
    expect(surveys).toEqual(mockSurveyModels());
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockRejectedValueOnce(new Error());

    const promise = sut.load("accountId");

    expect(promise).rejects.toThrow();
  });
});
