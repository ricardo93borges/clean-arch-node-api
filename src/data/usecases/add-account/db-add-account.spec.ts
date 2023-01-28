import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "id",
        name: "name",
        email: "email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
};

describe("DbAddAccount Usecase", () => {
  it("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "name",
      email: "email",
      password: "password",
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValue(new Error());
    const accountData = {
      name: "name",
      email: "email",
      password: "password",
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should call addAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "name",
      email: "email",
      password: "password",
    };

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });

  it("Should throw if addAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValue(new Error());
    const accountData = {
      name: "name",
      email: "email",
      password: "password",
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = {
      name: "name",
      email: "email",
      password: "password",
    };

    const account = await sut.add(accountData);

    expect(account).toEqual({
      ...accountData,
      id: "id",
      password: "hashed_password",
    });
  });
});
