import { EmailValidator } from "../../protocols";
import { badRequest, ok, serverError } from "../http/http-helper";
import { EmailValidation } from "./email-validation";

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();

  const sut = new EmailValidation("email", emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("Email Validation", () => {
  it("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const email = "email@email.com";
    sut.validate(email);
    expect(isValidSpy).toHaveBeenCalledWith(email);
  });

  it("should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});