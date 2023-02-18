import { DbLoadAccountByToken } from "./db-load-account-by-token";
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve("value");
    }
  }

  return new DecrypterStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe("DbLoadAccountByToken UseCase", () => {
  it("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const descryptSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.load("token", "role");

    expect(descryptSpy).toHaveBeenCalledWith("token");
  });

  it("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockResolvedValueOnce(null);

    const account = await sut.load("token", "role");

    expect(account).toBeNull();
  });

  it("should throw if loadAccountByTokenRepository throws", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockRejectedValueOnce(new Error());

    const promise = sut.load("token", "role");

    expect(promise).rejects.toThrow();
  });

  it("should call loadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );

    await sut.load("token", "role");

    expect(loadByTokenSpy).toHaveBeenCalledWith("token", "role");
  });

  it("should return null if loadAccountByTokenRepository returns null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockResolvedValueOnce(null);

    const account = await sut.load("token", "role");

    expect(account).toBeNull();
  });

  it("should return and account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.load("token", "role");
    expect(account).toEqual(makeFakeAccount());
  });

  it("should throw if loadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockRejectedValueOnce(new Error());

    const promise = sut.load("token", "role");

    expect(promise).rejects.toThrow();
  });
});
