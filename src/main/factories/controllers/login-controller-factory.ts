import { Controller } from "@/presentation/protocols";
import { makeLoginValidation } from "./login-validation-factory";
import { makeDbAuthentication } from "@/main/factories/usecases";
import { LoginController } from "@/presentation/controllers";
import { LogMongoRepository } from "@/infra/db";
import { LogControllerDecorator } from "@/main/decorators";

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication();
  const validationComposite = makeLoginValidation();
  const loginController = new LoginController(
    dbAuthentication,
    validationComposite
  );

  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
