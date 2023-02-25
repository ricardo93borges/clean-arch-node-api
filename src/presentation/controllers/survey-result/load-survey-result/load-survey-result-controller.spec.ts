import MockDate from "mockdate";

import {
  HttpRequest,
  LoadSurveyById,
  LoadSurveyResult,
} from "./load-survey-result-controller-protocols";
import {
  forbidden,
  noContent,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { mockLoadSurveyById, mockLoadSurveyResult } from "@/presentation/test";
import { LoadSurveyResultController } from "./load-survey-result-controller";
import { mockSurveyResultModel } from "@/domain/test";

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyResultStub: LoadSurveyResult;
  loadSurveyByIdStub: LoadSurveyById;
};

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: "surveyId",
  },
  accountId: "accountId",
});

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResult();
  const loadSurveysByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(
    loadSurveyResultStub,
    loadSurveysByIdStub
  );
  return {
    sut,
    loadSurveyResultStub,
    loadSurveyByIdStub: loadSurveysByIdStub,
  };
};

describe("LoadSurveyResultController Controller", () => {
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

  it("should call LoadSurveyResult with correct values", async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, "load");
    const request = mockRequest();

    await sut.handle(request);

    expect(loadSpy).toHaveBeenCalledWith("surveyId", "accountId");
  });

  it("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    jest.spyOn(loadSurveyResultStub, "load").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
