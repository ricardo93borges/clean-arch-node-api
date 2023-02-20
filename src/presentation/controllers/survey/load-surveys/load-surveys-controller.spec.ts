import MockDate from "mockdate";
import { LoadSurveysController } from "./load-surveys-controller";
import { LoadSurveys, SurveyModel } from "./load-surveys-controller-protocols";
import {
  noContent,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { mockSurveyModels } from "@/domain/test";
import { mockLoadSurveys } from "@/presentation/test";

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};

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

  it("should call LoadSurveys", async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, "load");

    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });

  it("should return 200 on success", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load");

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });

  it("should return 204 if LoadSurveys returns empty", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockResolvedValueOnce([]);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  it("should return 500 if LoadSurveys throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, "load").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
