import { AbstractPage } from "../router";
import template from './BucketPage.html';

const templEl: HTMLTemplateElement = document.createElement('template');
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const renderItems = (): void => {
      const goodsContainer: Element | null = templEl.content.querySelector('.goods');
      if (goodsContainer) {
        goodsContainer.innerHTML = '';

        let itemsInStorage: string | null = localStorage.getItem('items');
        let items: { name: string, price: string, quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : [];

        let totalPrice: number = 0;
        let totalQuantity: number = 0;

        items.forEach((item: { name: string, price: string, quantity?: number }, index: number) => {
          const bucketItem: HTMLDivElement = document.createElement('div');
          bucketItem.classList.add('bucket-item');
          bucketItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="remove-btn" data-index="${index}">Remove</button>
          `;
          goodsContainer.appendChild(bucketItem);

          totalPrice += parseFloat(item.price.replace('$', '')) * (item.quantity || 1);
          totalQuantity += item.quantity || 0;
        });

        const productsAmount: Element | null = document.querySelector('.products_amount');
        if (productsAmount) {
          productsAmount.textContent = totalQuantity.toString();
        }

        const productsSum: Element | null = templEl.content.querySelector('.products_sum');
        const priceSum: Element | null = templEl.content.querySelector('.price_sum');

        if (productsSum && priceSum) {
          productsSum.textContent = totalQuantity.toString();
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }

        goodsContainer.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('remove-btn')) {
            const indexToRemove: number = parseInt(target.getAttribute('data-index') || '');
            if (!isNaN(indexToRemove)) {
              items.splice(indexToRemove, 1);
              localStorage.setItem('items', JSON.stringify(items));
              renderItems();
            }
          }
        });
      }
    };

    renderItems();

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}