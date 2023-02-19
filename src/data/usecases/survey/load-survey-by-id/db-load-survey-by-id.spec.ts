import MockDate from "mockdate";
import { DbLoadSurveyById } from "./db-load-survey-by-id";
import {
  LoadSurveyByIdRepository,
  SurveyModel,
} from "./db-load-survey-by-id-protocols";

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeFakeSurvey = (): SurveyModel => ({
  id: "id",
  question: "question",
  date: new Date(),
  answers: [
    {
      image: "image",
      answer: "answer",
    },
  ],
});

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
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
    expect(survey).toEqual(makeFakeSurvey());
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
