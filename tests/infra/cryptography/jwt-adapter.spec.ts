import jwt from "jsonwebtoken";
import { JwtAdapter } from "@/infra/cryptography";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return Promise.resolve("token");
  },
  async verify(token: string): Promise<string> {
    return Promise.resolve("value");
  },
}));

const mekeSut = (): JwtAdapter => {
  const sut = new JwtAdapter("secret");
  return sut;
};

describe("JWT Adapter", () => {
  describe("sign()", () => {
    it("should call sign with correct values", async () => {
      const sut = mekeSut();
      const signSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt("id");
      expect(signSpy).toHaveBeenCalledWith({ id: "id" }, "secret");
    });

    it("should return a token on sign success", async () => {
      const sut = mekeSut();
      const token = await sut.encrypt("value");
      expect(token).toBe("token");
    });

    it("should throw if sign throws", async () => {
      const sut = mekeSut();
      jest.spyOn(jwt, "sign").mockImplementation(() => {
        throw new Error();
      });
      const promise = sut.encrypt("id");
      await expect(promise).rejects.toThrow();
    });
  });

  describe("verify()", () => {
    it("should call verify with correct values", async () => {
      const sut = mekeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("value");
      expect(verifySpy).toHaveBeenCalledWith("value", "secret");
    });

    it("should return a value on verify success", async () => {
      const sut = mekeSut();
      const value = await sut.decrypt("value");
      expect(value).toEqual("value");
    });

    it("should throw if verify throws", async () => {
      const sut = mekeSut();
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error();
      });
      const promise = sut.decrypt("value");
      await expect(promise).rejects.toThrow();
    });
  });
});
