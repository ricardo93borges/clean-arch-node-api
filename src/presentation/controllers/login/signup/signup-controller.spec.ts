import {
  EmailInUserError,
  MissingParamError,
  ServerError,
} from "@/presentation/errors";
import {
  AddAccount,
  Authentication,
  HttpRequest,
  Validation,
} from "./signup-controller-protocols";
import { SignUpController } from "./signup-controller";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { mockValidation } from "@/validation/test";
import { mockAuthentication } from "@/presentation/test";
import { mockAddAccount } from "@/presentation/test";

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const mockRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "password",
    passwordConfirmation: "password",
  },
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

    const httpRequest = mockRequest();

    const { name, email, password } = httpRequest.body;
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password,
    });
  });

  it("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockRejectedValue(new Error());

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
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

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockRejectedValueOnce(new Error());
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
