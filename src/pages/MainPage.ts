import { AbstractPage } from "../router";
import template from './MainPage.html';

const templEl = document.createElement('template');
templEl.innerHTML = template;

// Определение класса MainPage, который расширяет AbstractPage
export class MainPage extends AbstractPage {
  // Метод render возвращает HTMLElement или DocumentFragment
  render(): HTMLElement | DocumentFragment {
    // Клонируем содержимое шаблона
    const content = templEl.content.cloneNode(true) as DocumentFragment;

    // Получаем все кнопки с классом 'toBucket' в склонированном содержимом
    const toBucketButtons = content.querySelectorAll(".toBucket button");

    // Добавляем слушатель события 'click' для каждой кнопки
    toBucketButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Получаем информацию о товаре, используя ближайший родительский элемент с классом 'product'
        const product = button.closest('.product');
        if (product) {
          const productName = product.querySelector('.name')?.textContent || '';
          const productPrice = product.querySelector('.price')?.textContent || '';

          // Создаем объект товара
          const item = { name: productName, price: productPrice, quantity: 1 };

          // Получаем текущие данные из local storage или создаем новый массив
          const itemsInStorage = localStorage.getItem('items');
          const items = itemsInStorage ? JSON.parse(itemsInStorage) : [];

          // Проверяем, есть ли такой товар уже в корзине
          const existingItemIndex = items.findIndex((item: any) => item.name === productName);

          if (existingItemIndex !== -1) {
            // Если товар уже в корзине, увеличиваем его количество
            if (items[existingItemIndex].quantity !== undefined) {
              items[existingItemIndex].quantity += 1;
            } else {
              items[existingItemIndex].quantity = 1;
            }
          } else {
            // Иначе добавляем новый товар в массив
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

    // Возвращаем склонированное содержимое в виде DocumentFragment
    return content;
  }
}
