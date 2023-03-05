import { mockLoadAnswersBySurveyRepository } from "@/tests/data/mocks";
import { mockSurveyModel } from "@/tests/domain/mocks";
import { LoadAnswersBySurveyRepository } from "@/data/protocols";
import { DbLoadAnswersSurvey } from "@/data/usecases/";

type SutTypes = {
  sut: DbLoadAnswersSurvey;
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository;
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository();
  const sut = new DbLoadAnswersSurvey(loadAnswersBySurveyRepositoryStub);
  return { sut, loadAnswersBySurveyRepositoryStub };
};

describe("DbLoadAnswersSurvey Usecase", () => {
  it("should call LoadSurveyByIdRepository", async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut();

    const loadByIdSpy = jest.spyOn(
      loadAnswersBySurveyRepositoryStub,
      "loadAnswers"
    );
    await sut.loadAnswers("id");

    expect(loadByIdSpy).toHaveBeenCalledWith("id");
  });

  it("should return a answers on success", async () => {
    const { sut } = makeSut();
    const survey = mockSurveyModel();
    const expectedAnswers = survey.answers.map((a) => a.answer);

    const answers = await sut.loadAnswers("id");

    expect(answers).toEqual(expectedAnswers);
  });

  it("should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut();

    jest
      .spyOn(loadAnswersBySurveyRepositoryStub, "loadAnswers")
      .mockRejectedValueOnce(new Error());

    const promise = sut.loadAnswers("id");

    expect(promise).rejects.toThrow();
  });
});
