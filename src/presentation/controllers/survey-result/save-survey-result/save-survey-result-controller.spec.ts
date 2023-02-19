import MockDate from "mockdate";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  SaveSurveyResult,
  SaveSurveyResultModel,
  Validation,
  LoadSurveyById,
  SurveyModel,
  SurveyResultModel,
} from "./save-survey-result-controller-protocols";
import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";

type SutTypes = {
  sut: SaveSurveyResultController;
  validationStub: Validation;
  saveSurveyResultStub: SaveSurveyResult;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    answer: "answer",
    date: new Date(),
  },
  params: {
    surveyId: "surveyId",
  },
  accountId: "accountId",
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "id",
  surveyId: "surveyId",
  accountId: "accountId",
  answer: "answer",
  date: new Date(),
});

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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }

  return new SaveSurveyResultStub();
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveysByIdStub implements LoadSurveyById {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }

  return new LoadSurveysByIdStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const loadSurveysByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(
    validationStub,
    saveSurveyResultStub,
    loadSurveysByIdStub
  );
  return {
    sut,
    validationStub,
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
    const request = makeFakeRequest();

    await sut.handle(request);

    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
  });

  it("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockResolvedValueOnce(null);
    const request = makeFakeRequest();

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
    const httpRequest = makeFakeRequest();
    httpRequest.body.answer = "invalid_answer";

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    const request = makeFakeRequest();

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

  it("should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
  });
});
