import { html } from "lit-html";

import { showNotification } from "./notification.js";

import cartIcon from "../assets/images/icons/cart.svg";
import dewaltImage from "../assets/images/products/dewalt-pro-700.jpg";
import metaboImage from "../assets/images/products/metabo-600.jpg";
import scaleIcon from "../assets/images/icons/scale.svg";
import heartIcon from "../assets/images/icons/heart.svg";
import whiteStar from "../assets/images/icons/star_white.svg";
import yellowStar from "../assets/images/icons/star_yellow.svg";
import minusIcon from "../assets/images/icons/minus.svg";
import plusIcon from "../assets/images/icons/plus.svg";

const productImages = {
    "1": dewaltImage,
    "2": metaboImage,
};

const formatPrice = (price, currency = "€", minimumFractionDigits = 2) => {
    const formatted = new Intl.NumberFormat("sk-SK", {
        minimumFractionDigits,
        maximumFractionDigits: 2,
    }).format(price);

    return `${formatted} ${currency}`;
};

const changeQuantity = (event, amount) => {
    const card = event.currentTarget.closest(".c-product-card");
    const input = card.querySelector(".c-product-card__quantity-input");
    const currentQuantity = Number(input.value) || 1;

    input.value = Math.max(1, currentQuantity + amount);
};

const addProductToCart = (event, product) => {
    const card = event.currentTarget.closest(".c-product-card");
    const input = card.querySelector(".c-product-card__quantity-input");
    const quantity = Number(input.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        showNotification("Musíš vybrať aspoň 1 kus.", "warning");
        return;
    }

    if (quantity > 10) {
        showNotification("Naraz môžeš pridať najviac 10 kusov.", "warning");
        return;
    }

    showNotification(`Pridané do košíka: ${quantity} ks produktu ${product.name}.`, "success");
};

export const productCard = (product) => html`
    <article class="c-product-card">
        <div class="c-product-card__image-area">
            <div class="c-product-card__badges">
                ${(product.badges ?? []).map((badge) => html`
                        <span class="c-product-card__badge c-product-card__badge--${badge.type}">${badge.label}</span>
                    `)}
            </div>
            <div class="c-product-card__actions">
                <button type="button" aria-label="Porovnať produkt">
                    <img src="${scaleIcon}" alt="" />
                </button>
                <button type="button" aria-label="Pridať medzi obľúbené">
                    <img src="${heartIcon}" alt="" />
                </button>
            </div>
            <img class="c-product-card__image" src="${productImages[product.id] ?? product.imageUrl}" alt="${product.name}" loading="lazy"/>
        </div>

        <div class="c-product-card__rating" aria-label="Hodnotenie ${product.rating} z 5, ${product.reviewCount} recenzií">
            <span class="c-product-card__stars" aria-hidden="true">
                ${Array.from({ length: 5 }, (_, index) => html`
                <img class="c-product-card__star" src="${index < product.rating ? yellowStar : whiteStar}" alt=""/>
                `)}
            </span>
            <span class="c-product-card__review-count">(${product.reviewCount})</span>
        </div>
</span>

        <h3 class="c-product-card__name">${product.name}</h3>
        <p class="c-product-card__sku">${product.sku}</p>
        <p class="c-product-card__original-price">${formatPrice(product.originalPrice, product.currency, 0)}</p>
        <p class="c-product-card__sale-price">${formatPrice(product.salePrice, product.currency)}</p>
        <p class="c-product-card__vat-price">${formatPrice(product.priceWithoutVAT, product.currency)} bez DPH</p>
        <p class="c-product-card__stock">${product.stock}</p>

        <div class="c-product-card__purchase">
            <div class="c-product-card__quantity">
                <button type="button" aria-label="Znížiť množstvo" @click=${(event) => changeQuantity(event, -1)}>
                    <img src="${minusIcon}" alt="" />
                </button>
                <input class="c-product-card__quantity-input" type="number" min="1" value="1" aria-label="Počet kusov"/>
                <button type="button" aria-label="Zvýšiť množstvo" @click=${(event) => changeQuantity(event, 1)}>
                    <img src="${plusIcon}" alt="" />
                </button>
            </div>
            <button class="c-product-card__cart-button" type="button" @click=${(event) => addProductToCart(event, product)}>
                <img class="c-product-card__cart-icon" src="${cartIcon}" alt="" />Do košíka
            </button>
        </div>
    </article>
`;