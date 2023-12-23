import {AbstractPage} from "./AbstractPage";

export interface PageClass {
  new(...args: any[]): AbstractPage;
}
