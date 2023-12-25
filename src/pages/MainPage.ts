import { AbstractPage } from "../router";
import template from './MainPage.html';

const templEl: HTMLTemplateElement = document.createElement('template'); // Создание элемента шаблона
templEl.innerHTML = template; // Заполнение элемента шаблона HTML-кодом главной страницы

export class MainPage extends AbstractPage { // Объявление класса MainPage, который расширяет AbstractPage
  render(): HTMLElement | DocumentFragment { // Метод отображения содержимого главной страницы
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment; // Клонирование содержимого шаблона для отображения страницы

    const toBucketButtons: NodeListOf<HTMLButtonElement> = content.querySelectorAll(".toBucket button"); // Поиск кнопок перехода в корзину

    toBucketButtons.forEach((button: HTMLButtonElement) => { // Для каждой кнопки установить обработчик клика
      button.addEventListener('click', () => { // Обработчик клика по кнопке
        const product: Element | null = button.closest('.product'); // Находим ближайший элемент товара, связанный с кнопкой
        if (product) { // Если товар найден
          const productName: string = product.querySelector('.name')?.textContent || ''; // Получение имени товара
          const productPrice: string = product.querySelector('.price')?.textContent || ''; // Получение цены товара

          const item: { name: string, price: string, quantity: number } = { name: productName, price: productPrice, quantity: 1 }; // Создание объекта товара

          let itemsInStorage: string | null = localStorage.getItem('items'); // Получение данных о товарах из localStorage
          let items = itemsInStorage ? JSON.parse(itemsInStorage) : []; // Преобразование данных в массив товаров

          const existingItemIndex = items.findIndex((item: any) => item.name === productName); // Поиск индекса существующего товара

          if (existingItemIndex !== -1) { // Если товар уже существует в корзине
            if (items[existingItemIndex].quantity !== undefined) { // Если у товара указано количество
              items[existingItemIndex].quantity += 1; // Увеличиваем количество товара
            } else {
              items[existingItemIndex].quantity = 1; // Устанавливаем количество товара
            }
          } else {
            items.push(item); // Добавляем товар в корзину
          }

          localStorage.setItem('items', JSON.stringify(items)); // Сохраняем обновленные данные о товарах в localStorage
          this.updateProductsAmount(); // Обновляем количество товаров в шапке
        }
      });
    });

    this.updateProductsAmount(); // Обновляем количество товаров в шапке при загрузке страницы

    return content; // Возврат содержимого страницы
  }

  private updateProductsAmount(): void { // Метод обновления количества товаров в шапке
    const productsAmount: Element | null = document.querySelector('.products_amount'); // Поиск элемента для отображения количества товаров
    if (productsAmount) { // Если элемент найден
      let itemsInStorage: string | null = localStorage.getItem('items'); // Получение данных о товарах из localStorage
      let items: { name: string, price: string, quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : []; // Преобразование данных в массив товаров
      const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0); // Вычисление общего количества товаров

      productsAmount.textContent = totalQuantity.toString(); // Отображение общего количества товаров
    }
  }
}
