import { AbstractPage } from "../router";
import template from './MainPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class MainPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}