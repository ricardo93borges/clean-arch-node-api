import { AccountModel } from "@/domain/models/account";
import { AddAccountParams } from "@/domain/usecases/add-account";
import { AuthenticationParams } from "@/domain/usecases/authentication";

export const mockAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

export const mockAccountParams = (): AddAccountParams => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: "email@email.com",
  password: "password",
});
