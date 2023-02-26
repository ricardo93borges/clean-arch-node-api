import { MissingParamError } from "@/presentation/errors";
import { RequiredFieldValidation } from "@/validation/validators/required-field-validation";

describe("RequiredField Validation", () => {
  it("should return a MissingParamError if validation fails", async () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should not return a MissingParamError if validation succeeds", async () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ field: "field" });
    expect(error).toBeFalsy();
  });
});
