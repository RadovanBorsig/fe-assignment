import { html } from "lit-html";

import electricToolsImage from "../assets/images/categories/elektricke-naradie.jpg";
import gardenImage from "../assets/images/categories/zahrada-lest.jpg";
import cleaningImage from "../assets/images/categories/cistenie-a-upratovanie.jpg";
import handToolsImage from "../assets/images/categories/rucne-naradie.jpg";
import accessoriesImage from "../assets/images/categories/prislusenstvo.jpg";

const categoryImages = {
    "elektricke-naradie": electricToolsImage,
    "zahrada-a-les": gardenImage,
    "cistenie-a-upratovanie": cleaningImage,
    "rucne-naradie": handToolsImage,
    "prislusenstvo": accessoriesImage,
};

export const categoryCard = (category) => html`
    <article class="c-category-card c-category-card--${category.id}">
        <img
            class="c-category-card__image"
            src="${categoryImages[category.id] ?? category.imageUrl}"
            alt=""
            loading="lazy"
        />
        <div class="c-category-card__overlay"></div>
        <div class="c-category-card__content">
            <h3 class="c-category-card__title">
                <span>${category.name}</span>
                <span class="c-category-card__count">${category.productCount}</span>
            </h3>

            <ul class="c-category-card__subcategories">
                ${(category.subcategories ?? []).map(
                    (subcategory) => html`
                        <li>
                            <a href="${subcategory.link}">${subcategory.name}</a>
                        </li>
                    `
                )}
            </ul>

            <a class="c-category-card__link" href="${category.link}">
                <span class="c-category-card__link-label"
                    >${category.ctaText || "Všetky kategórie"}</span
                >
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </article>
`;
