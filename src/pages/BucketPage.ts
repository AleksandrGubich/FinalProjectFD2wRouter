import { AbstractPage } from "../router";
import template from "./BucketPage.html";

const templEl: HTMLTemplateElement = document.createElement("template");
templEl.innerHTML = template;

export class BucketPage extends AbstractPage {
  render(): HTMLElement | DocumentFragment {
    const content: DocumentFragment = templEl.content.cloneNode(true) as DocumentFragment;

    const goodsContainer: Element | null = content.querySelector(".goods");
    const priceSum: Element | null = content.querySelector(".price_sum");

    const updateLocalStorage = (items: { name: string; price: string; quantity?: number }[]) => {
      localStorage.setItem("items", JSON.stringify(items));
      const updateProductsAmountEvent = new CustomEvent("updateProductsAmount");
      document.dispatchEvent(updateProductsAmountEvent);
    };

    const updateCart = (items: { name: string; price: string; quantity?: number }[]) => {
      if (goodsContainer) {
        goodsContainer.innerHTML = "";
        let totalPrice = 0;

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
        });

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

        const updateProductsAmountEvent = new CustomEvent("updateProductsAmount");
        document.dispatchEvent(updateProductsAmountEvent);
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

    const handleUpdateProductsAmount = () => {
      const productsAmount: Element | null = document.querySelector('.products_sum');
      if (productsAmount) {
        let itemsInStorage: string | null = localStorage.getItem('items');
        let items: { name: string; price: string; quantity?: number }[] = itemsInStorage ? JSON.parse(itemsInStorage) : [];
        const totalQuantity: number = items.reduce((total: number, item: { quantity?: number }) => total + (item.quantity || 0), 0);
        productsAmount.textContent = totalQuantity.toString();
      }
    };

    document.addEventListener("updateProductsAmount", handleUpdateProductsAmount);

    const itemsInStorage: string | null = localStorage.getItem("items");
    const items: { name: string; price: string; quantity?: number }[] = itemsInStorage
      ? JSON.parse(itemsInStorage)
      : [];

    updateCart(items);

    // Обновляем количество товаров в шапке при загрузке страницы корзины
    handleUpdateProductsAmount();

    return content;
  }
}
