import { mockAccountModel } from "@/tests/domain/mocks";
import {
  mockDecrypter,
  mockLoadAccountByTokenRepository,
} from "@/tests/data/mocks";
import { Decrypter } from "@/data/protocols/cryptography/decrypter";
import { DbLoadAccountByToken } from "@/data/usecases";
import { LoadAccountByTokenRepository } from "@/data/protocols";

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
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

  it("should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockRejectedValueOnce(new Error());

    const token = await sut.load("token", "role");

    expect(token).toBeNull();
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
    expect(account).toEqual(mockAccountModel());
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
