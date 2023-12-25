import { AbstractPage } from "../router";
import template from "./BucketPage.html";

const templEl: HTMLTemplateElement = document.createElement("template"); // Создание элемента шаблона
templEl.innerHTML = template; // Заполнение элемента шаблона HTML-кодом страницы корзины

export class BucketPage extends AbstractPage { // Объявление класса BucketPage, который расширяет AbstractPage
  render(): HTMLElement | DocumentFragment { // Метод отображения содержимого корзины
    const content: DocumentFragment = templEl.content.cloneNode(
      true
    ) as DocumentFragment; // Клонирование содержимого шаблона для отображения страницы

    const goodsContainer: Element | null = content.querySelector(".goods"); // Поиск контейнера товаров в корзине

    const renderItems = (): void => { // Функция для отображения товаров в корзине
      if (goodsContainer) { // Проверка наличия контейнера товаров
        goodsContainer.innerHTML = ""; // Очистка контейнера от предыдущих элементов

        let itemsInStorage: string | null = localStorage.getItem("items"); // Получение данных о товарах из localStorage
        let items: { name: string; price: string; quantity?: number }[] =
          itemsInStorage ? JSON.parse(itemsInStorage) : []; // Преобразование данных в массив товаров

        let totalPrice: number = 0; // Инициализация общей цены товаров
        let totalQuantity: number = 0; // Инициализация общего количества товаров

        items.forEach( // Перебор товаров
          (
            item: { name: string; price: string; quantity?: number }, // Информация о каждом товаре
            index: number
          ) => {
            const bucketItem: HTMLDivElement = document.createElement("div"); // Создание элемента для товара
            bucketItem.classList.add("bucket-item"); // Добавление класса для стилизации
            bucketItem.innerHTML = `
              <p>${item.name}</p>
              <p>${item.price}</p>
              <p>Количество: ${item.quantity}</p>
              <button class="remove-btn" data-index="${index}">Удалить из корзины</button>
            `; // Вставка информации о товаре и кнопки удаления в элемент товара
            goodsContainer.appendChild(bucketItem); // Добавление товара в контейнер корзины

            totalPrice +=
              parseFloat(item.price.replace("$", "")) * (item.quantity || 1); // Вычисление общей цены товаров
            totalQuantity += item.quantity || 0; // Вычисление общего количества товаров
          }
        );

        const productsAmount: Element | null =
          document.querySelector(".products_amount"); // Поиск элемента для отображения общего количества товаров
        if (productsAmount) { // Если элемент найден
          productsAmount.textContent = totalQuantity.toString(); // Отображение общего количества товаров
        }

        // Отображение общего количества и суммы товаров в корзине
        const productsSum: Element | null = content.querySelector(".products_sum");
        const priceSum: Element | null = content.querySelector(".price_sum");
        if (productsSum && priceSum) {
          productsSum.textContent = totalQuantity.toString();
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }
      }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => { // Функция обработки удаления товара
      if (!isNaN(indexToRemove)) { // Проверка корректности индекса товара
        let itemsInStorage: string | null = localStorage.getItem("items"); // Получение данных о товарах из localStorage
        let items: { name: string; price: string; quantity?: number }[] =
          itemsInStorage ? JSON.parse(itemsInStorage) : []; // Преобразование данных в массив товаров

        const itemToRemove = items[indexToRemove]; // Получение информации о товаре для удаления

        // Проверка количества товара: уменьшение на 1, если больше одного; иначе - удаление
        if (itemToRemove.quantity && itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          items.splice(indexToRemove, 1);
        }

        localStorage.setItem("items", JSON.stringify(items)); // Обновление данных о товарах в localStorage
        renderItems(); // Перерендеринг после удаления элемента
      }
    };

    if (goodsContainer) { // Если контейнер товаров найден
      goodsContainer.addEventListener("click", (event: Event) => { // Обработчик клика по контейнеру
        const target = event.target as HTMLElement;
        if (target.classList.contains("remove-btn")) { // Если клик был по кнопке удаления
          const indexToRemove: number = parseInt(
            target.getAttribute("data-index") || ""
          ); // Получение индекса товара для удаления
          handleRemoveButtonClick(indexToRemove); // Вызов функции удаления товара
        }
      });
    }

    renderItems(); // Отображение товаров при загрузке страницы
    return content; // Возврат содержимого страницы корзины
  }
}
