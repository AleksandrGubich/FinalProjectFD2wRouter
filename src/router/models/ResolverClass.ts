import {Resolver} from "./Resolver";

export interface ResolverClass<T = unknown> {
  new(): Resolver<T>;
}
