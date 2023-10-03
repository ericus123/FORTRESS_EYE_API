import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

@Injectable()
export class UserService {
  logger = new Logger("User Service");
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async addUser(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByPk(id);
      return user;
    } catch (error) {
      throw new Error("Error finding user");
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll();
      return users;
    } catch (error) {
      this.logger.error(error);
      //   throw new Error("Error finding user");
    }
  }
}
