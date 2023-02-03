import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe("Validation Composite", () => {
  it("should return an error if any validation fails", async () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "value" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return the first error if more than on validation fails", async () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "value" });
    expect(error).toEqual(new Error());
  });

  it("should not return if validation succeeds", async () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "value" });
    expect(error).toBeFalsy();
  });
});