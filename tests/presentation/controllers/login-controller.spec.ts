import { MissingParamError } from "@/presentation/errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@/presentation/helpers/http/http-helper";
import { mockAuthentication, mockValidation } from "@/tests/presentation/mocks";
import { LoginController } from "@/presentation/controllers";
import { HttpRequest, Validation } from "@/presentation/protocols";
import { Authentication } from "@/domain/usecases";

type SutTypes = {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const mockRequest = (): HttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "password",
  },
});

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();

  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, validationStub, authenticationStub };
};

describe("Login Controller", () => {
  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toBeCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockResolvedValueOnce(null);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockRejectedValueOnce(new Error());
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      ok({ accessToken: "token", name: "any_name" })
    );
  });

  it("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    const error = new MissingParamError("any_field");
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(error));
  });
});
