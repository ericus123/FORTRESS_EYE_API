import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
  async isMatch({
    hash,
    password,
  }: {
    hash: string;
    password: string;
  }): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default HashingService;
