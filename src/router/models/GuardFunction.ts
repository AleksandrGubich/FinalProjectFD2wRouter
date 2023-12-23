import {RedirectPath} from "./RedirectPath";
import {ActivatedRouteState} from "./ActivatedRouteState";

export interface GuardFunction {
  (state: ActivatedRouteState): boolean | Promise<boolean> | RedirectPath | Promise<RedirectPath>;
}
