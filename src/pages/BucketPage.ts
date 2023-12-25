import { AbstractPage } from "../router";
import template from './BucketPage.html';

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const renderItems = () => {
      const goodsContainer = templEl.content.querySelector('.goods');
      if (goodsContainer) {
        goodsContainer.innerHTML = ''; // Очищаем контейнер товаров

        let itemsInStorage = localStorage.getItem('items');
        let items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

        let totalPrice = 0;
        let totalQuantity = 0;

        items.forEach((item: any, index: number) => {
          const bucketItem = document.createElement('div');
          bucketItem.classList.add('bucket-item');
          bucketItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="remove-btn" data-index="${index}">Remove</button>
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

        // Обработчик удаления элемента
        goodsContainer.addEventListener('click', (event) => {
          if ((event.target as HTMLElement).classList.contains('remove-btn')) {
            const indexToRemove = (event.target as HTMLElement).getAttribute('data-index');
            if (indexToRemove !== null) {
              items.splice(parseInt(indexToRemove), 1); // Удаляем элемент из массива
              localStorage.setItem('items', JSON.stringify(items)); // Обновляем localStorage
              renderItems(); // Перерисовываем список товаров
            }
          }
        });
      }
    };

    renderItems();

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}
