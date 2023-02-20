import { EmailValidator } from "../protocols/email-validator";
import { mockEmailValidator } from "../test";
import { EmailValidation } from "./email-validation";

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();

  const sut = new EmailValidation("email", emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("Email Validation", () => {
  it("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const email = "email@email.com";
    const input = { email };
    sut.validate(input);
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
