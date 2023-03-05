import MockDate from "mockdate";
import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import {
  mockCheckSurveyById,
  mockLoadSurveyResult,
} from "@/tests/presentation/mocks";
import { mockSurveyResultModel } from "@/tests/domain/mocks";
import { LoadSurveyResultController } from "@/presentation/controllers";
import { CheckSurveyById, LoadSurveyResult } from "@/domain/usecases";

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyResultStub: LoadSurveyResult;
  checkSurveyByIdStub: CheckSurveyById;
};

const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: "surveyId",
  accountId: "accountId",
});

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResult();
  const checkSurveyByIdStub = mockCheckSurveyById();
  const sut = new LoadSurveyResultController(
    loadSurveyResultStub,
    checkSurveyByIdStub
  );
  return {
    sut,
    loadSurveyResultStub,
    checkSurveyByIdStub,
  };
};

describe("LoadSurveyResultController Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call CheckSurveyById with correct values", async () => {
    const { sut, checkSurveyByIdStub } = makeSut();
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, "checkById");
    const request = mockRequest();

    await sut.handle(request);

    expect(checkByIdSpy).toHaveBeenCalledWith(request.surveyId);
  });

  it("should return 403 if CheckSurveyById returns false", async () => {
    const { sut, checkSurveyByIdStub } = makeSut();
    jest.spyOn(checkSurveyByIdStub, "checkById").mockResolvedValueOnce(false);
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("should return 500 if CheckSurveyById throws", async () => {
    const { sut, checkSurveyByIdStub } = makeSut();
    jest
      .spyOn(checkSurveyByIdStub, "checkById")
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

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

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
