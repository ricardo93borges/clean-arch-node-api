import { Controller } from "@/presentation/protocols";
import { makeSignUpValidation } from "./signup-validation-factory";
import {
  makeDbAddAccount,
  makeDbAuthentication,
} from "@/main/factories/usecases";
import { SignUpController } from "@/presentation/controllers";
import { LogMongoRepository } from "@/infra/db";
import { LogControllerDecorator } from "@/main/decorators";

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount();
  const dbAuthentication = makeDbAuthentication();
  const validationComposite = makeSignUpValidation();
  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
    dbAuthentication
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
