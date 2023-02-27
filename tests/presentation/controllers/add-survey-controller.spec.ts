import MockDate from "mockdate";
import {
  badRequest,
  noContent,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { mockAddSurvey, mockValidation } from "@/tests/presentation/mocks";
import { Validation } from "@/presentation/protocols";
import { AddSurveyController } from "@/presentation/controllers";
import { AddSurvey } from "@/domain/usecases";

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const mockRequest = (): AddSurveyController.Request => ({
  question: "question",
  answers: [
    {
      image: "image",
      answer: "answer",
    },
  ],
});

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurvey();
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
    const request = mockRequest();

    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it("should 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it("should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const request = mockRequest();
    const date = new Date();

    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({ ...request, date });
  });

  it("should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(new Error());
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 204 on success", async () => {
    const { sut } = makeSut();
    const request = mockRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(noContent());
  });
});
