import { AbstractPage } from "../router";
import template from './BucketPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const renderItems = () => {
      const goodsContainer = templEl.content.querySelector('.goods');
      if (goodsContainer) {
        goodsContainer.innerHTML = ''; // Очищаем контейнер товаров

        const itemsInStorage = localStorage.getItem('items');
        const items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

        let totalPrice = 0;
        let totalQuantity = 0;

        items.forEach((item: any) => {
          const bucketItem = document.createElement('div');
          bucketItem.classList.add('bucket-item');
          bucketItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="remove-btn">Remove</button>
          `;
          goodsContainer.appendChild(bucketItem);

          // Обновляем общую стоимость и количество товаров
          totalPrice += parseFloat(item.price.replace('$', '')) * (item.quantity || 1);
          totalQuantity += item.quantity || 0;
        });

        const productsAmount = document.querySelector('.products_amount');
        if (productsAmount) {
          productsAmount.textContent = totalQuantity.toString();
        }

        // Обновляем общую сумму и количество товаров в шапке корзины
        const productsSum = templEl.content.querySelector('.products_sum');
        const priceSum = templEl.content.querySelector('.price_sum');

        if (productsSum && priceSum) {
          productsSum.textContent = totalQuantity.toString();
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }
      }
    };

    renderItems();

    const goodsContainer = templEl.content.querySelector('.goods');
    if (goodsContainer) {
      goodsContainer.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).classList.contains('remove-btn')) {
          const itemToRemove = (event.target as HTMLElement).closest('.bucket-item');
          if (itemToRemove) {
            itemToRemove.remove();
            renderItems(); // Пересчитываем сумму и количество после удаления товара
          }
        }
      });
    }

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}