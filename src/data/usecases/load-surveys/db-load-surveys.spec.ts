import MockDate from "mockdate";
import { DbLoadSurveys } from "./db-load-surveys";
import { SurveyModel } from "../../../domain/models/survey";
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository";

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "id",
      question: "question",
      date: new Date(),
      answers: [
        {
          image: "image",
          answer: "answer",
        },
      ],
    },
  ];
};

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }

  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
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
    expect(surveys).toEqual(makeFakeSurveys());
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
