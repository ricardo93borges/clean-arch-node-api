import MockDate from "mockdate";
import {
  forbidden,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import {
  mockLoadAnswersBySurvey,
  mockSaveSurveyResult,
} from "@/tests/presentation/mocks";
import { SaveSurveyResultController } from "@/presentation/controllers";
import { SaveSurveyResult } from "@/domain/usecases";
import { LoadAnswersBySurvey } from "@/domain/usecases/load-answers-by-survey";

type SutTypes = {
  sut: SaveSurveyResultController;
  saveSurveyResultStub: SaveSurveyResult;
  loadAnswersBySurveyStub: LoadAnswersBySurvey;
};

const mockRequest = (): SaveSurveyResultController.Request => ({
  answer: "answer",
  surveyId: "surveyId",
  accountId: "accountId",
});

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult();
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey();
  const sut = new SaveSurveyResultController(
    saveSurveyResultStub,
    loadAnswersBySurveyStub
  );
  return {
    sut,
    saveSurveyResultStub,
    loadAnswersBySurveyStub,
  };
};

describe("SaveSurveyResultController Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadAnswersBySurvey with correct values", async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut();
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyStub, "loadAnswers");
    const request = mockRequest();

    await sut.handle(request);

    expect(loadAnswersSpy).toHaveBeenCalledWith(request.surveyId);
  });

  it("should return 403 if LoadAnswersBySurvey returns an empty array", async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut();
    jest
      .spyOn(loadAnswersBySurveyStub, "loadAnswers")
      .mockResolvedValueOnce([]);
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("should return 500 if LoadAnswersBySurvey throws", async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut();
    jest
      .spyOn(loadAnswersBySurveyStub, "loadAnswers")
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const request = mockRequest();
    request.answer = "invalid_answer";

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    const request = mockRequest();

    await sut.handle(request);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer,
    });
  });

  it("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
