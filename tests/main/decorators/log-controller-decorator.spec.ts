import { ok, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { LogControllerDecorator } from "../../../src/main/decorators/log-controller-decorator";
import { mockAccountModel } from "@/tests/domain/mocks";
import { mockLogErrorRepository } from "@/tests/data/mocks";
import { LogErrorRepository } from "@/data/protocols";

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeFakeRequest = () => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "password",
  passwordConfirmation: "password",
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: any): Promise<HttpResponse> {
      return Promise.resolve(ok(mockAccountModel()));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

describe("Log Controller Decorator", () => {
  it("should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const request = makeFakeRequest();
    await sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  it("should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const request = makeFakeRequest();

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()));
    const request = makeFakeRequest();
    await sut.handle(request);

    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
