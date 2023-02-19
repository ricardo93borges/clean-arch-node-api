import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { password, email } = authentication;
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);

    if (account) {
      const isEqual = await this.hashComparer.compare(
        password,
        account.password
      );

      if (isEqual) {
        const token = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          token
        );
        return token;
      }
    }

    return null;
  }
}
