import MockDate from "mockdate";
import { mockAddSurveyRepository } from "@/tests/data/mocks";
import { mockAddSurveyParams } from "@/tests/domain/mocks";
import { DbAddSurvey } from "@/data/usecases";
import { AddSurveyRepository } from "@/data/protocols";

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
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
    const surveyData = mockAddSurveyParams();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it("should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const surveyData = mockAddSurveyParams();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockRejectedValueOnce(new Error());

    const promise = sut.add(surveyData);

    expect(promise).rejects.toThrow();
  });
});
