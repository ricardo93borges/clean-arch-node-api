import { adaptResolver } from "@/main/adapters";
import {
  makeLoginController,
  makeSignUpController,
} from "@/main/factories/controllers";

export default {
  Query: {
    login: async (parent: any, args: any) => {
      return adaptResolver(makeLoginController(), args);
    },
  },

  Mutation: {
    signUp: async (parent: any, args: any) => {
      return adaptResolver(makeSignUpController(), args);
    },
  },
};
