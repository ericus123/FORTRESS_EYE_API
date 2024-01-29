import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MediaService {
  private readonly uploadsFolder: string =
    process.env.UPLOADS_DESTINATION || "./uploads";

  getAllFiles(): string[] {
    const files = fs.readdirSync(this.uploadsFolder);
    return files;
  }

  getFile(filename: string, _path?: string): string | null {
    const filePath = path.join(
      this.uploadsFolder,
      _path != undefined ? _path : "/",
      filename,
    );
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }

  uploadFile(
    file: { filename: string; buffer: Buffer },
    _path?: string,
  ): string {
    const filePath = path.join(
      this.uploadsFolder,
      _path != undefined ? _path : "/",
      file.filename,
    );
    fs.writeFileSync(filePath, file.buffer);
    return file.filename;
  }

  deleteFile(filename: string, _path?: string): boolean {
    const filePath = path.join(
      this.uploadsFolder,
      _path != undefined ? _path : "/",
      filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}
