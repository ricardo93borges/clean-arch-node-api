import jwt from "jsonwebtoken";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { Decrypter } from "@/data/protocols/criptography/decrypter";

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secret);
    return token;
  }

  async decrypt(token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret);
    return value;
  }
}
