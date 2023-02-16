import MockDate from "mockdate";
import {
  AddSurvey,
  AddSurveyModel,
  HttpRequest,
  Validation,
} from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller";
import {
  badRequest,
  noContent,
  serverError,
} from "../../../helpers/http/http-helper";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "question",
    date: new Date(),
    answers: [
      {
        image: "image",
        answer: "answer",
      },
    ],
  },
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

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add(data: AddSurveyModel): Promise<void> {
      return Promise.resolve();
    }
  }
  const addSurveyStub = new AddSurveyStub();
  return addSurveyStub;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return { sut, validationStub, addSurveyStub };
};

describe("AddSurvey Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it("should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(new Error());
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
