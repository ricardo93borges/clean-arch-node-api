import { InvalidParamError } from "../../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

describe("CompareFields Validation", () => {
  it("should return a InvalidParamError if validation fails", async () => {
    const sut = new CompareFieldsValidation("field", "fieldToCompare");
    const error = sut.validate({
      field: "value",
      fieldToCompare: "different_value",
    });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });

  it("should not return a MissingParamError if validation succeeds", async () => {
    const sut = new CompareFieldsValidation("field", "fieldToCompare");
    const error = sut.validate({
      field: "value",
      fieldToCompare: "value",
    });
    expect(error).toBeFalsy();
  });
});
