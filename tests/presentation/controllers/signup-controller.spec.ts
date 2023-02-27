import {
  EmailInUserError,
  MissingParamError,
  ServerError,
} from "@/presentation/errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import {
  mockAddAccount,
  mockAuthentication,
  mockValidation,
} from "@/tests/presentation/mocks";
import { SignUpController } from "@/presentation/controllers";
import { AddAccount, Authentication } from "@/domain/usecases";
import { Validation } from "@/presentation/protocols";

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const mockRequest = (): SignUpController.Request => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "password",
  passwordConfirmation: "password",
});

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return { sut, addAccountStub, validationStub, authenticationStub };
};

describe("SignUp Controller", () => {
  it("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    const request = mockRequest();

    const { name, email, password } = request;
    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password,
    });
  });

  it("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockRejectedValue(new Error());

    const request = mockRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it("should return 403 if addAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUserError()));
  });

  it("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      ok({ accessToken: "token", name: "any_name" })
    );
  });

  it("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");

    const request = mockRequest();
    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    const error = new MissingParamError("any_field");
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(error));
  });

  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const request = mockRequest();
    await sut.handle(request);
    expect(authSpy).toBeCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockRejectedValueOnce(new Error());
    const request = mockRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
