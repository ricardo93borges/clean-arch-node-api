import { mockAccountModel, mockAccountParams } from "@/tests/domain/mocks";
import {
  mockAddAccountRepository,
  mockHasher,
  mockLoadAccountByEmailRepository,
} from "@/tests/data/mocks";
import { Hasher } from "@/data/protocols/cryptography/hasher";
import { DbAddAccount } from "@/data/usecases";
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "@/data/protocols";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  jest
    .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
    .mockResolvedValue(null);
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  it("should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");
    const accountData = mockAccountParams();
    await sut.add(accountData);

    expect(hashSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValue(new Error());
    const accountData = mockAccountParams();

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should call addAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = mockAccountParams();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });

  it("Should throw if addAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValue(new Error());
    const accountData = mockAccountParams();

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = mockAccountParams();
    const account = await sut.add(accountData);

    expect(account).toEqual(mockAccountModel());
  });

  it("should return null if LoadAccountByEmailRepository not return null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockResolvedValueOnce(mockAccountModel());
    const account = await sut.add(mockAccountParams());
    expect(account).toBeNull();
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(mockAccountParams());
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
