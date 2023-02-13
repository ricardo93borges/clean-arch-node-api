import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository";
import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogControllerDecorator } from "../../../decorators/log-controller-decorator";
import { makeDbAddAccount } from "../../usecases/add-account/db-add-account";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

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
