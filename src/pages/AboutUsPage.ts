import { AbstractPage } from "../router";
import template from './AboutUsPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class AboutUsPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}