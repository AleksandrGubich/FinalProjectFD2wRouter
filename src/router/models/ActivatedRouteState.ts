import {PathParams} from "./PathParams";
import {ResolvedData} from "./ResolvedData";

export interface ActivatedRouteState {
  url: string;
  params: PathParams;
  resolvedData: null | ResolvedData;
}
