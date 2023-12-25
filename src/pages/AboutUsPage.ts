import { AbstractPage } from "../router";
import template from './AboutUsPage.html';

const templEl = document.createElement('template'); // Создание элемента шаблона
templEl.innerHTML = template; // Заполнение элемента шаблона HTML-кодом страницы "AboutUsPage"

export class AboutUsPage extends AbstractPage { // Объявление класса AboutUsPage, который расширяет AbstractPage
  render(): HTMLElement | DocumentFragment { // Метод отображения содержимого страницы
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment; // Клонирование содержимого шаблона для отображения страницы

    const handleUpdateProductsAmount = () => { // Обработчик для обновления количества товаров в шапке
      const productsAmount: Element | null = document.querySelector('.products_sum'); // Поиск элемента для отображения количества товаров
      if (productsAmount) { // Если элемент найден
        let itemsInStorage: string | null = localStorage.getItem('items'); // Получение данных о товарах из localStorage
        let items: { name: string; price: string; quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : []; // Преобразование данных в массив товаров
        const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0); // Вычисление общего количества товаров
        productsAmount.textContent = totalQuantity.toString(); // Отображение общего количества товаров
      }
    };

    document.addEventListener("updateProductsAmount", handleUpdateProductsAmount); // Добавление обработчика события для обновления количества товаров

    // Обновляем количество товаров в шапке при загрузке страницы "AboutUsPage"
    handleUpdateProductsAmount(); // Вызов функции для обновления количества товаров при загрузке страницы

    return content; // Возврат содержимого страницы
  }
}
