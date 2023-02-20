import { MissingParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols";
import { ValidationComposite } from "./validation-composite";
import { mockValidation } from "../test";

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
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
