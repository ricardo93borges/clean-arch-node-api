import {
  forbidden,
  ok,
  serverError,
} from "@/presentation/helpers/http/http-helper";
import { AccessDeniedError } from "@/presentation/errors";
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware";
import {
  LoadAccountByToken,
  HttpRequest,
} from "../../../src/presentation/middlewares/auth-middleware-protocols";
import { mockLoadAccountByToken } from "../mocks";

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const mockRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "token",
  },
});

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

describe("Auth Middleware", () => {
  it("should return 403 if no x-access-token exists in the headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should call LoadAccountByToken with correct accessToken", async () => {
    const role = "role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith("token", role);
  });

  it("should return 403 if loadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, "load").mockResolvedValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should return 200 if loadAccountByToken returns an account", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });

  it("should return 500 if loadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
