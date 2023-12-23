import {ActivatedRouteState} from "./ActivatedRouteState";

export interface Resolver<T = unknown> {
  resolve(state: ActivatedRouteState): T | Promise<T>;
}
