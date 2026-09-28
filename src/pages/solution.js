import { html } from "lit-html";
import { loadData } from "../dataLoader.js";

import { solutionBanner } from "../components/solutionBanner.js";
import { solutionCta } from "../components/solutionCta.js";
import { formModal } from "../components/formModal.js";
import { productCard } from "../components/productCard.js";
import { categoryCard } from "../components/categoryCard.js";

/**
 * Solution Page
 */

// Main page template
export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    const products = Array.isArray(data.products) ? data.products.filter(Boolean) : [];
    const categories = Array.isArray(data.categories) ? data.categories.filter(Boolean) : [];

    console.log("data.banner:\n", data.banner);
    console.log("data.ctaBanner:\n", data.ctaBanner);
    console.log("data.products:\n", data.products);
    console.log("data.categories:\n", data.categories);

    return html`
        <div class="l-solution">
            <div class="l-solution__banner">
                <div class="l-container">${data.banner ? solutionBanner(data.banner) : html``}</div>
            </div>

            <div class="l-solution__content">
                <div class="l-container is-shorter">
                    <div class="c-solution-content">
                        <div class="c-solution-content__cta">
                            ${data.ctaBanner ? solutionCta(data.ctaBanner) : html``}
                        </div>

                        <div class="c-solution-content__products">
                            ${products.length
                                    ? html`
                                        <div class="c-product-grid">
                                            ${products.map((product) => productCard(product))}
                                        </div>
                                    `
                                    : html`<p>Momentálne nie sú dostupné žiadne produkty.</p>`}
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="notification"
                class="c-notification"
                role="status"
                aria-live="polite"
                hidden
            ></div>

            <div class="l-solution__categories">
                <div class="l-container">
                    <div class="c-solution-categories">
                        <h2 class="c-solution-categories__title">Top kategórie produktov</h2>
                        ${categories.length
                                ? html`
                                    <div class="c-category-grid">
                                        ${categories.map((category) => categoryCard(category))}
                                    </div>
                                `
                                : html`<p>Momentálne nie sú dostupné žiadne kategórie.</p>`}</div>
                </div>
            </div>
            ${formModal()}
        </div>
    `;
};

/**
 * Load data and render the solution page
 */
export const loadAndRenderSolutionPage = async () => {
    try {
        const data = await loadData();
        return renderSolutionPage(data);
    } catch (error) {
        return html`<div class="l-solution">Error loading data: ${error.message}</div>`;
    }
};
