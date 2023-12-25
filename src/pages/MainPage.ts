import { AbstractPage } from "../router";
import template from './MainPage.html';

const templEl: HTMLTemplateElement = document.createElement('template');
templEl.innerHTML = template;

export class MainPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment;

    const toBucketButtons: NodeListOf<HTMLButtonElement> = content.querySelectorAll(".toBucket button");

    toBucketButtons.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', () => {
        const product: Element | null = button.closest('.product');
        if (product) {
          const productName: string = product.querySelector('.name')?.textContent || '';
          const productPrice: string = product.querySelector('.price')?.textContent || '';

          const item: { name: string, price: string, quantity: number } = { name: productName, price: productPrice, quantity: 1 };

          let itemsInStorage: string | null = localStorage.getItem('items');
          let items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

          const existingItemIndex = items.findIndex((item: any) => item.name === productName);

          if (existingItemIndex !== -1) {
            if (items[existingItemIndex].quantity !== undefined) {
              items[existingItemIndex].quantity += 1;
            } else {
              items[existingItemIndex].quantity = 1;
            }
          } else {
            items.push(item);
          }

          localStorage.setItem('items', JSON.stringify(items));
          this.updateProductsAmount(); // Обновляем количество товаров в шапке
        }
      });
    });

    this.updateProductsAmount(); // Обновляем количество товаров в шапке при загрузке страницы

    return content;
  }

  private updateProductsAmount(): void {
    const productsAmount: Element | null = document.querySelector('.products_amount');
    if (productsAmount) {
      let itemsInStorage: string | null = localStorage.getItem('items');
      let items: { name: string, price: string, quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : [];
      const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0);
      productsAmount.textContent = totalQuantity.toString();
    }
  }
}