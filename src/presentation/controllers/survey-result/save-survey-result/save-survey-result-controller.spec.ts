import MockDate from "mockdate";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  SaveSurveyResult,
  SaveSurveyResultParams,
  LoadSurveyById,
  SurveyModel,
  SurveyResultModel,
} from "./save-survey-result-controller-protocols";
import {
  forbidden,
  noContent,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { mockSurveyResultModel, mockSurveyModel } from "@/domain/test";
import { mockLoadSurveyById, mockSaveSurveyResult } from "@/presentation/test";

type SutTypes = {
  sut: SaveSurveyResultController;
  saveSurveyResultStub: SaveSurveyResult;
  loadSurveyByIdStub: LoadSurveyById;
};

const mockRequest = (): HttpRequest => ({
  body: {
    answer: "answer",
    date: new Date(),
  },
  params: {
    surveyId: "surveyId",
  },
  accountId: "accountId",
});

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult();
  const loadSurveysByIdStub = mockLoadSurveyById();
  const sut = new SaveSurveyResultController(
    saveSurveyResultStub,
    loadSurveysByIdStub
  );
  return {
    sut,
    saveSurveyResultStub,
    loadSurveyByIdStub: loadSurveysByIdStub,
  };
};

describe("SaveSurveyResultController Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyById with correct values", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");
    const request = mockRequest();

    await sut.handle(request);

    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
  });

  it("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockResolvedValueOnce(null);
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    httpRequest.body.answer = "invalid_answer";

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    const request = mockRequest();

    await sut.handle(request);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: request.params.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.body.answer,
    });
  });

  it("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
