import { LogMongoRepository } from "@/infra/db/mongodb/log/log-mongo-repository";
import { LoginController } from "@/presentation/controllers/login/login/login-controller";
import { Controller } from "@/presentation/protocols";
import { LogControllerDecorator } from "../../../../decorators/log-controller-decorator";
import { makeDbAuthentication } from "../../../usecases/account/authentication/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";

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
