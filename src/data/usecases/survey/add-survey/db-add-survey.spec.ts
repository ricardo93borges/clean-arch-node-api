import MockDate from "mockdate";
import {
  AddSurveyParams,
  AddSurveyRepository,
} from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: "question",
  date: new Date(),
  answers: [{ image: "image", answer: "answer" }],
});

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

describe("DbAddSurvey Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const surveyData = makeFakeSurveyData();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it("should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const surveyData = makeFakeSurveyData();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());

    const promise = sut.add(surveyData);

    expect(promise).rejects.toThrow();
  });
});
