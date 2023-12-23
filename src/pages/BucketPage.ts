import { AbstractPage } from "../router";
import template from './BucketPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}