import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import { IpfsService } from "./ipfs/ipfs.service";
import { User } from "./user/user.model";
import { UserService } from "./user/user.service";

@Controller()
export class AppController {
  logger = new Logger("App Controller");
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly ipfsService: IpfsService,
  ) {}

  @Get()
  async getHello(): Promise<User[]> {
    const users = await this.userService.getUsers();
    this.logger.debug("Users", users);
    this.ipfsService.addFile(
      Buffer.from(
        JSON.stringify({
          data: "sample data",
        }),
      ),
    );
    return users;
  }
}
