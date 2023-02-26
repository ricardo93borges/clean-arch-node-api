import MockDate from "mockdate";
import { DbLoadSurveyById } from "@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id";
import { LoadSurveyByIdRepository } from "@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { mockLoadSurveyByIdRepository } from "@/tests/data/mocks";
import { mockSurveyModel } from "@/tests/domain/mocks";

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyByIdRepositoryStub };
};

describe("DbLoadSurveyById Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyByIdRepository", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    await sut.loadById("id");

    expect(loadByIdSpy).toHaveBeenCalledWith("id");
  });

  it("should return a survey on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById("id");
    expect(survey).toEqual(mockSurveyModel());
  });

  it("should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockRejectedValueOnce(new Error());

    const promise = sut.loadById("id");

    expect(promise).rejects.toThrow();
  });
});
