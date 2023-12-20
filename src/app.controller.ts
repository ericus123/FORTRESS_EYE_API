import { Controller, Get, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";
import { UserService } from "./user/user.service";

@Controller()
export class AppController {
  logger = new Logger("App Controller");
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  getHome() {
    return "Hello World 🚀";
  }
}
