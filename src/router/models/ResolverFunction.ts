import {ActivatedRouteState} from "./ActivatedRouteState";

export interface ResolverFunction<T = unknown> {
  (state: ActivatedRouteState): T | Promise<T>;
}
