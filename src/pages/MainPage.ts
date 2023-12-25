import { AbstractPage } from "../router";
import template from './MainPage.html'

const templEl = document.createElement('template');
templEl.innerHTML = template;

// В MainPage.ts

// Определение класса MainPage, который расширяет AbstractPage
export class MainPage extends AbstractPage {
  // Метод render возвращает HTMLElement или DocumentFragment
  render(): HTMLElement | DocumentFragment {
    // Получаем все кнопки с классом 'toBucket'
    const toBucketButtons = templEl.content.querySelectorAll(".toBucket button");

    // Для каждой кнопки устанавливаем слушатель события 'click'
    toBucketButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Получаем информацию о товаре
        const product = button.closest('.product');
        if (product) {
          const productName = product.querySelector('.name')?.textContent || '';
          const productPrice = product.querySelector('.price')?.textContent || '';

          // Создаем объект товара
          const item = { name: productName, price: productPrice };

          // Получаем текущие данные из local storage или создаем новый массив
          const itemsInStorage = localStorage.getItem('items');
          const items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

          // Проверяем, есть ли такой товар уже в корзине
          const existingItem = items.find((item: any) => item.name === productName);

          if (existingItem) {
            // Если товар уже в корзине, увеличиваем его количество
            if (existingItem.quantity !== undefined) {
              existingItem.quantity += 1;
            } else {
              existingItem.quantity = 1;
            }
          } else {
            // Иначе добавляем новый товар в массив
            // Проверяем наличие 'quantity' в объекте item, если нет, устанавливаем его в 1
            (item as { name: string; price: string; quantity?: number }).quantity = 1;
            items.push(item);

          }

          // Обновляем local storage
          localStorage.setItem('items', JSON.stringify(items));

          // Обновляем количество товаров в шапке
          const productsAmount = document.querySelector('.products_amount');
          if (productsAmount) {
            productsAmount.textContent = items.length.toString();
          }
        }
      });
    });

    // Клонируем содержимое шаблона и возвращаем его в виде DocumentFragment
    return templEl.content as DocumentFragment;
  }
}
