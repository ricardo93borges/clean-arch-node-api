import { mockAuthentication } from "@/tests/domain/mocks";
import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from "@/tests/data/mocks";
import { Encrypter } from "@/data/protocols/cryptography/encrypter";
import { HashComparer } from "@/data/protocols/cryptography/hash-comparer";
import { DbAuthentication } from "@/data/usecases/db-authentication";
import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "@/data/protocols";

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub: encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication Usecase", () => {
  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.auth(mockAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("email@email.com");
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(mockAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("password", "any_password");
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub: encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(mockAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub: encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should call Encrypter with correct id", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toEqual({ accessToken: "token", name: "any_name" });
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );

    await sut.auth(mockAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });
});
