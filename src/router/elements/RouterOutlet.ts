import {ROUTER_BUS} from "../constants";

const ROUTER_OUTLET_TEMPLATE = document.createElement('template');
ROUTER_OUTLET_TEMPLATE.innerHTML = `
<style>
.router-outlet {
    position: relative;
}
</style>
<div class="router-outlet">
    <slot name="page"></slot>
    <slot name="loader"></slot>
</div>
`.trim();


customElements.define('router-outlet', class RouterOutlet extends HTMLElement {
  readonly #shadowRoot = this.attachShadow({ mode: "open" });
  readonly #loader = document.createElement('div');
  readonly #page = document.createElement('div');
  #timerId: number | undefined;

  readonly #onNavigateStart = (): void => {
    clearTimeout(this.#timerId);
    this.#timerId = setTimeout(() => {
      this.appendChild(this.#loader);
    }, 150) as unknown as number;
  };

  readonly #onNavigateCancel = (): void => {
    this.#cancelLoader();
  };

  readonly #onNavigateEnd = (event: Event): void => {
    const { detail: { content } } = event as CustomEvent<{ content: HTMLElement | DocumentFragment }>;

    this.#page.replaceChildren(content);
    this.appendChild(this.#page);
    this.#cancelLoader();
  };

  constructor() {
    super();
    this.#shadowRoot.appendChild(ROUTER_OUTLET_TEMPLATE.content.cloneNode(true));
    this.#loader.setAttribute('slot', 'loader');
    this.#page.setAttribute('slot', 'page');
    this.#loader.append(...this.childNodes);
  }

  connectedCallback(): void {
    ROUTER_BUS.addEventListener('navigatestart', this.#onNavigateStart);
    ROUTER_BUS.addEventListener('navigateend', this.#onNavigateEnd);
    ROUTER_BUS.addEventListener('navigatecancel', this.#onNavigateCancel);
  }

  disconnectedCallback(): void {
    ROUTER_BUS.removeEventListener('navigatestart', this.#onNavigateStart);
    ROUTER_BUS.removeEventListener('navigateend', this.#onNavigateEnd);
    ROUTER_BUS.removeEventListener('navigatecancel', this.#onNavigateCancel);
  }

  #cancelLoader(): void {
    this.#loader.remove();
    clearTimeout(this.#timerId);
  }

});
