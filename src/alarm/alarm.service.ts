import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { assignUUID } from "../helpers";
import { Alarm } from "./alarm.model";

@Injectable()
export class AlarmService {
  constructor(
    @InjectModel(Alarm)
    private readonly alarmModel: typeof Alarm,
  ) {}

  async getAlarm(id: string): Promise<Alarm> {
    try {
      const alarm = await this.alarmModel.findByPk(id, {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!alarm) {
        throw new NotFoundException("Alarm not found");
      }

      return alarm;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAlarms(): Promise<Alarm[]> {
    try {
      return await this.alarmModel.findAll({
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

  async addAlarm(input: Alarm): Promise<Alarm> {
    try {
      return await this.alarmModel.create(assignUUID(input), {
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

  async deleteAlarm(id: string): Promise<boolean> {
    try {
      const alarm = await this.getAlarm(id);
      await alarm.destroy();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateAlarm(id: string, input: Alarm): Promise<Alarm> {
    try {
      const alarm = await this.getAlarm(id);
      await alarm.update(input);
      return alarm;
    } catch (error) {
      throw new Error(error);
    }
  }
}
