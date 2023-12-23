import {PageClass} from "./PageClass";
import {GuardFunction} from "./GuardFunction";
import {GuardClass} from "./GuardClass";
import {ResolverFunction} from "./ResolverFunction";
import {ResolverClass} from "./ResolverClass";

export interface RouteConfig {
  path: string;
  page?: PageClass;
  redirectTo?: string;
  guards?: (GuardFunction | GuardClass)[];
  resolve?: Record<string, ResolverFunction | ResolverClass>;
}
