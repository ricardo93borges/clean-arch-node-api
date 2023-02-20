import { mockAccountModel } from "@/domain/test";
import { AddAccount, AddAccountParams } from "@/domain/usecases/add-account";
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { AccountModel } from "@/domain/models/account";
import {
  Authentication,
  AuthenticationParams,
} from "@/domain/usecases/authentication";

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccountModel()));
    }
  }
  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth(authentication: AuthenticationParams): Promise<string> {
      return Promise.resolve("token");
    }
  }
  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByTokenStub();
};
