import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";
import { DbAuthentication } from "./db.authentication";

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "email@email.com",
  password: "password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepositoryStub
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return Promise.resolve("token");
    }
  }
  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
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
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("email@email.com");
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("password", "hashed_password");
  });

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub: encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("valid_id");
  });

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub: encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should call Encrypter with correct id", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("token");
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );

    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("valid_id", "token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });
});
