import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file): { filename: string } {
    try {
      console.log("running");
      const filename = this.mediaService.uploadFile(file);
      return { filename };
    } catch (error) {
      console.log(error);
    }
  }
}
