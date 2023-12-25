import { AbstractPage } from "../router";
import template from "./BucketPage.html";

const templEl: HTMLTemplateElement = document.createElement("template"); // Создание элемента шаблона
templEl.innerHTML = template; // Заполнение элемента шаблона HTML-кодом страницы "BucketPage"

export class BucketPage extends AbstractPage { // Объявление класса BucketPage, который расширяет AbstractPage
  render(): HTMLElement | DocumentFragment { // Метод отображения содержимого страницы
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment; // Клонирование содержимого шаблона для отображения страницы

    const goodsContainer: Element | null = content.querySelector(".goods"); // Поиск контейнера для товаров
    const priceSum: Element | null = content.querySelector(".price_sum"); // Поиск элемента для отображения общей суммы цен товаров

    const updateLocalStorage = (items: { name: string; price: string; quantity?: number }[]) => { // Функция для обновления данных в localStorage
      localStorage.setItem("items", JSON.stringify(items)); // Обновление данных о товарах в localStorage
      const updateProductsAmountEvent = new CustomEvent("updateProductsAmount"); // Создание события для обновления количества товаров
      document.dispatchEvent(updateProductsAmountEvent); // Отправка события обновления количества товаров
    };

    const updateCart = (items: { name: string; price: string; quantity?: number }[]) => { // Функция для обновления корзины с товарами
      if (goodsContainer) { // Если контейнер для товаров найден
        goodsContainer.innerHTML = ""; // Очистка контейнера от предыдущих товаров
        let totalPrice = 0; // Инициализация общей суммы цен товаров

        items.forEach((item, index) => { // Перебор товаров
          const bucketItem: HTMLDivElement = document.createElement("div"); // Создание элемента для товара
          bucketItem.classList.add("bucket-item"); // Добавление класса для стилизации товара
          bucketItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Количество: ${item.quantity}</p>
            <button class="remove-btn" data-index="${index}">Удалить из корзины</button>
          `; // Вставка информации о товаре в элемент

          goodsContainer.appendChild(bucketItem); // Добавление товара в контейнер корзины

          totalPrice += parseFloat(item.price.replace("$", "")) * (item.quantity || 1); // Вычисление общей суммы цен товаров
        });

        if (priceSum) { // Если элемент для отображения суммы найден
          priceSum.textContent = `$${totalPrice.toFixed(2)}`; // Отображение общей суммы цен товаров
        }
      }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => { // Обработчик клика по кнопке "Удалить из корзины"
      if (!isNaN(indexToRemove)) { // Если переданный индекс для удаления является числом
        let itemsInStorage: string | null = localStorage.getItem("items"); // Получение данных о товарах из localStorage
        let items: { name: string; price: string; quantity?: number }[] = // Преобразование данных в массив товаров
          itemsInStorage ? JSON.parse(itemsInStorage) : [];

        const itemToRemove = items[indexToRemove]; // Получение товара для удаления по индексу

        if (itemToRemove.quantity && itemToRemove.quantity > 1) { // Если количество товара больше 1
          itemToRemove.quantity -= 1; // Уменьшение количества товара на 1
        } else { // Иначе, если количество равно 1 или отсутствует
          items.splice(indexToRemove, 1); // Удаление товара из корзины
        }

        updateLocalStorage(items); // Обновление данных в localStorage
        updateCart(items); // Обновление отображения корзины с товарами

        const updateProductsAmountEvent = new CustomEvent("updateProductsAmount"); // Создание события для обновления количества товаров
        document.dispatchEvent(updateProductsAmountEvent); // Отправка события обновления количества товаров
      }
    };

    if (goodsContainer) { // Если контейнер для товаров найден
      goodsContainer.addEventListener("click", (event: Event) => { // Обработчик клика по контейнеру товаров
        const target = event.target as HTMLElement; // Получение цели клика
        if (target.classList.contains("remove-btn")) { // Если кликнули по кнопке "Удалить из корзины"
          const indexToRemove: number = parseInt(target.getAttribute("data-index") || ""); // Получение индекса товара для удаления
          handleRemoveButtonClick(indexToRemove); // Вызов функции удаления товара из корзины
        }
      });
    }

    const handleUpdateProductsAmount = () => { // Функция для обновления количества товаров в шапке
      const productsAmount: Element | null = document.querySelector('.products_sum'); // Поиск элемента для отображения количества товаров
      if (productsAmount) { // Если элемент найден
        let itemsInStorage: string | null = localStorage.getItem('items'); // Получение данных о товарах из localStorage
        let items: { name: string; price: string; quantity?: number }[] = // Преобразование данных в массив товаров
          itemsInStorage ? JSON.parse(itemsInStorage) : [];
        const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0); // Вычисление общего количества товаров
        productsAmount.textContent = totalQuantity.toString(); // Отображение общего количества товаров
      }
    };

    document.addEventListener("updateProductsAmount", handleUpdateProductsAmount); // Добавление обработчика события для обновления количества товаров

    const itemsInStorage: string | null = localStorage.getItem("items"); // Получение данных о товарах из localStorage
    const items: { name: string; price: string; quantity?: number }[] = itemsInStorage // Преобразование данных в массив товаров
      ? JSON.parse(itemsInStorage)
      : [];

    updateCart(items); // Обновление корзины с товарами

    // Обновляем количество товаров в шапке при загрузке страницы корзины
    handleUpdateProductsAmount(); // Вызов функции для обновления количества товаров при загрузке страницы

    return content; // Возврат содержимого страницы
  }
}
