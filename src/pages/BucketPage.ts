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

        // Получаем товары из local storage
        const itemsInStorage = localStorage.getItem('items');
        const items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

        let totalPrice = 0;
        let totalQuantity = 0;

        // Для каждого товара из local storage создаем элемент в корзине
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

          totalPrice += parseFloat(item.price.replace('$', '')) * item.quantity;
          totalQuantity += item.quantity;
        });

        // Обновляем общее количество товаров и общую сумму
        const productsAmount = templEl.content.querySelector('.products_amount');
        const productsSum = templEl.content.querySelector('.products_sum');
        const priceSum = templEl.content.querySelector('.price_sum');

        if (productsAmount && productsSum && priceSum) {
          productsAmount.textContent = totalQuantity.toString();
          productsSum.textContent = totalQuantity.toString();
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }
      }
    };

    renderItems(); // Вызываем функцию отображения товаров при загрузке страницы

    // Находим контейнер товаров в корзине
    const goodsContainer = document.querySelector('.goods');
    if (goodsContainer) {
      // Устанавливаем слушатель события 'click' для контейнера товаров в корзине
      goodsContainer.addEventListener('click', (event) => {
        // Проверяем, была ли нажата кнопка 'Remove' внутри элемента корзины
        if ((event.target as HTMLElement).classList.contains('remove-btn')) {
          // Находим элемент корзины, который нужно удалить
          const itemToRemove = (event.target as HTMLElement).closest('.bucket-item');
          if (itemToRemove) {
            // Удаляем элемент корзины из DOM
            itemToRemove.remove();
          }
        }
      });
    }

    return templEl.content as DocumentFragment;
  }
}
