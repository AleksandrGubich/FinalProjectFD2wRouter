import {ActivatedRouteState} from "./ActivatedRouteState";

export abstract class AbstractPage {
  readonly #state: ActivatedRouteState;

  constructor(state: ActivatedRouteState) {
    this.#state = state;
  }

  protected get routeState(): ActivatedRouteState {
    return this.#state;
  }

  abstract render(): HTMLElement | DocumentFragment;

  onRender(): void {

  }

  onDestroy(): void {

  }
}
