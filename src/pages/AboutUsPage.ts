import { AbstractPage } from "../router";
import template from './AboutUsPage.html';

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class AboutUsPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment;

    const handleUpdateProductsAmount = () => {
      const productsAmount: Element | null = document.querySelector('.products_sum');
      if (productsAmount) {
        let itemsInStorage: string | null = localStorage.getItem('items');
        let items: { name: string; price: string; quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : [];
        const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0);
        productsAmount.textContent = totalQuantity.toString();
      }
    };

    document.addEventListener("updateProductsAmount", handleUpdateProductsAmount);

    // Обновляем количество товаров в шапке при загрузке страницы "AboutUsPage"
    handleUpdateProductsAmount();

    return content;
  }
}
