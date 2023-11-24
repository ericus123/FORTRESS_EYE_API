import { v4 as uuidv4 } from "uuid";

export const assignUUID = (obj: any) => {
  obj.id = uuidv4();
  return obj;
};
