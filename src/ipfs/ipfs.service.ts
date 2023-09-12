// ipfs.service.ts

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import IPFS from "ipfs-http-client";

@Injectable()
export class IpfsService {
  private ipfs: any;
  logger = new Logger("IPFS Service");
  constructor(configService: ConfigService) {
    this.ipfs = IPFS(configService.get<string>("IPFS_URI"));
  }

  async addFile(fileBuffer: Buffer): Promise<string> {
    try {
      const result = await this.ipfs.add(fileBuffer);
      return result.cid.toString();
    } catch (error) {
      this.logger.error(`Failed to add file to IPFS: ${error.message}`);
      throw new Error(`Failed to add file to IPFS: ${error.message}`);
    }
  }

  async getFile(cid: string): Promise<Buffer> {
    try {
      const stream = this.ipfs.cat(cid);
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Failed to retrieve file to IPFS: ${error.message}`);
      throw new Error(`Failed to retrieve file from IPFS: ${error.message}`);
    }
  }
}
