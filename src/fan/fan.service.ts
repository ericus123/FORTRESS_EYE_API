import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { assignUUID } from "../helpers";
import { Fan } from "./fan.model";

@Injectable()
export class FanService {
  constructor(
    @InjectModel(Fan)
    private readonly fanModel: typeof Fan,
  ) {}

  async getFan(id: string): Promise<Fan> {
    try {
      const fan = await this.fanModel.findByPk(id, {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!fan) {
        throw new NotFoundException("Fan not found");
      }

      return fan;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFans(): Promise<Fan[]> {
    try {
      return await this.fanModel.findAll({
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

  async addFan(input: Fan): Promise<Fan> {
    try {
      return await this.fanModel.create(assignUUID(input), {
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

  async deleteFan(id: string): Promise<boolean> {
    try {
      const fan = await this.getFan(id);
      await fan.destroy();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateFan(id: string, input: Fan): Promise<Fan> {
    try {
      const fan = await this.getFan(id);
      await fan.update(input);
      return fan;
    } catch (error) {
      throw new Error(error);
    }
  }
}
