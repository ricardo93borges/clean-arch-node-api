import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator;

  private readonly fieldName: string;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
