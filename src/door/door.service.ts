import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { assignUUID } from "../helpers";
import { Door } from "./door.model";

@Injectable()
export class DoorService {
  constructor(
    @InjectModel(Door)
    private readonly doorModel: typeof Door,
  ) {}

  async getDoor(id: string): Promise<Door> {
    try {
      const door = await this.doorModel.findByPk(id, {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!door) {
        throw new NotFoundException("Door not found");
      }

      return door;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDoors(): Promise<Door[]> {
    try {
      const doors = await this.doorModel.findAll({
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
      return doors;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addDoor(input: Door): Promise<Door> {
    try {
      return await this.doorModel.create(assignUUID(input), {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteDoor(id: string): Promise<boolean> {
    try {
      const door = await this.getDoor(id);
      await door.destroy();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateDoor(id: string, input: Door): Promise<Door> {
    try {
      const door = await this.getDoor(id);
      await door.update(input);

      return door;
    } catch (error) {
      throw new Error(error);
    }
  }
}
