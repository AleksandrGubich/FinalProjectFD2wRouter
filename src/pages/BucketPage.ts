import { AbstractPage } from "../router";
import template from './BucketPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const renderItems = () => {
      const goodsContainer = document.querySelector('.goods');
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
        const productsAmount = document.querySelector('.products_amount');
        const productsSum = document.querySelector('.products_sum');
        const priceSum = document.querySelector('.price_sum');

        if (productsAmount && productsSum && priceSum) {
          productsAmount.textContent = totalQuantity.toString();
          productsSum.textContent = totalQuantity.toString();
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }
      }
    };

    renderItems(); // Вызываем функцию отображения товаров при загрузке страницы

    // Устанавливаем слушатель для удаления товаров из корзины
    const goodsContainer = document.querySelector('.goods');
    if (goodsContainer) {
      goodsContainer.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).classList.contains('remove-btn')) {
          const itemName = (event.target as HTMLElement).previousElementSibling?.textContent || '';
          let items = localStorage.getItem('items');
          if (items) {
            const parsedItems: { name: string; price: string; quantity?: number }[] = JSON.parse(items);
            // Убедимся, что items не null перед использованием метода filter
            if (Array.isArray(parsedItems)) {
              const updatedItems = parsedItems.filter((item) => item.name !== itemName);
              localStorage.setItem('items', JSON.stringify(updatedItems));
            }
          }
          renderItems();

        }
      });
    }

    return templEl.content.cloneNode(true) as DocumentFragment;
  }
}
