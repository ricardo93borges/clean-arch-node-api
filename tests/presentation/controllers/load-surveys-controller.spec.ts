import MockDate from "mockdate";
import {
  noContent,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { mockLoadSurveys } from "../mocks";
import { mockSurveyModels } from "@/tests/domain/mocks";
import { LoadSurveysController } from "@/presentation/controllers";
import { LoadSurveys } from "@/domain/usecases";

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: "accountId",
});

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return { sut, loadSurveysStub };
};

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveys with correct value", async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, "load");
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenCalledWith(httpRequest.accountId);
  });

  it("should return 200 on success", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load");

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });

  it("should return 204 if LoadSurveys returns empty", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockResolvedValueOnce([]);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });

  it("should return 500 if LoadSurveys throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
