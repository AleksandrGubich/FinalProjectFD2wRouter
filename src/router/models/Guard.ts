import {RedirectPath} from "./RedirectPath";
import {ActivatedRouteState} from "./ActivatedRouteState";

export interface Guard {
  canActivate(state: ActivatedRouteState): boolean | Promise<boolean> | RedirectPath | Promise<RedirectPath>;
}
