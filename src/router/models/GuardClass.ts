import {Guard} from "./Guard";

export interface GuardClass {
  new(): Guard;
}
