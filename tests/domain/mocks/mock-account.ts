import { AccountModel } from "@/domain/models/account";
import { AddAccount } from "@/domain/usecases/add-account";
import { Authentication } from "@/domain/usecases/authentication";

export const mockAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

export const mockAccountParams = (): AddAccount.Params => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

export const mockAuthentication = (): Authentication.Params => ({
  email: "email@email.com",
  password: "password",
});
