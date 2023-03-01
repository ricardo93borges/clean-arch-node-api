import { mockAccountParams } from "@/tests/domain/mocks";
import {
  mockAddAccountRepository,
  mockCheckAccountByEmailRepository,
  mockHasher,
} from "@/tests/data/mocks";
import { Hasher } from "@/data/protocols/cryptography/hasher";
import { DbAddAccount } from "@/data/usecases";
import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
} from "@/data/protocols";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub,
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

  it("should return true on success", async () => {
    const { sut } = makeSut();
    const accountData = mockAccountParams();
    const account = await sut.add(accountData);

    expect(account).toEqual(true);
  });

  it("should return true if CheckAccountByEmailRepository not return false", async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(checkAccountByEmailRepositoryStub, "checkByEmail")
      .mockResolvedValueOnce(false);

    const isValid = await sut.add(mockAccountParams());

    expect(isValid).toEqual(true);
  });

  it("should call CheckAccountByEmailRepository with correct email", async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      checkAccountByEmailRepositoryStub,
      "checkByEmail"
    );
    await sut.add(mockAccountParams());
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
