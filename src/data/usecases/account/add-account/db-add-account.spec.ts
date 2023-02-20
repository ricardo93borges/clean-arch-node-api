import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeFakeAccountData = (): AddAccountParams => ({
  name: "name",
  email: "valid_email@email.com",
  password: "password",
});

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new AddAccountRepositoryStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepositoryStub
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
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
    const accountData = makeFakeAccountData();
    await sut.add(accountData);

    expect(hashSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValue(new Error());
    const accountData = makeFakeAccountData();

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should call addAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });

  it("Should throw if addAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValue(new Error());
    const accountData = makeFakeAccountData();

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccountData();
    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });

  it("should return null if LoadAccountByEmailRepository not return null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockResolvedValueOnce(makeFakeAccount());
    const account = await sut.add(makeFakeAccountData());
    expect(account).toBeNull();
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(makeFakeAccountData());
    expect(loadSpy).toHaveBeenCalledWith("valid_email@email.com");
  });
});
