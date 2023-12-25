import { AbstractPage } from "../router";
import template from "./BucketPage.html";

const templEl: HTMLTemplateElement = document.createElement("template");
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment;

    const goodsContainer: Element | null = content.querySelector(".goods");
    const productsAmount: Element | null = content.querySelector(".products_sum");
    const priceSum: Element | null = content.querySelector(".price_sum");

    const updateLocalStorage = (items: { name: string; price: string; quantity?: number }[]) => {
      localStorage.setItem("items", JSON.stringify(items));
    };

    const updateCart = (items: { name: string; price: string; quantity?: number }[]) => {
      if (goodsContainer) {
        goodsContainer.innerHTML = "";
        let totalPrice = 0;
        let totalQuantity = 0;

        items.forEach((item, index) => {
          const bucketItem: HTMLDivElement = document.createElement("div");
          bucketItem.classList.add("bucket-item");
          bucketItem.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Количество: ${item.quantity}</p>
            <button class="remove-btn" data-index="${index}">Удалить из корзины</button>
          `;
          goodsContainer.appendChild(bucketItem);

          totalPrice += parseFloat(item.price.replace("$", "")) * (item.quantity || 1);
          totalQuantity += item.quantity || 0;
        });

        if (productsAmount) {
          productsAmount.textContent = totalQuantity.toString();
        }

        if (priceSum) {
          priceSum.textContent = `$${totalPrice.toFixed(2)}`;
        }
      }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
      if (!isNaN(indexToRemove)) {
        let itemsInStorage: string | null = localStorage.getItem("items");
        let items: { name: string; price: string; quantity?: number }[] =
          itemsInStorage ? JSON.parse(itemsInStorage) : [];

        const itemToRemove = items[indexToRemove];

        if (itemToRemove.quantity && itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          items.splice(indexToRemove, 1);
        }

        updateLocalStorage(items);
        updateCart(items);
      }
    };

    if (goodsContainer) {
      goodsContainer.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("remove-btn")) {
          const indexToRemove: number = parseInt(target.getAttribute("data-index") || "");
          handleRemoveButtonClick(indexToRemove);
        }
      });
    }

    // Отображение товаров при загрузке страницы
    const itemsInStorage: string | null = localStorage.getItem("items");
    const items: { name: string; price: string; quantity?: number }[] = itemsInStorage
      ? JSON.parse(itemsInStorage)
      : [];

    updateCart(items);

    return content;
  }
}
