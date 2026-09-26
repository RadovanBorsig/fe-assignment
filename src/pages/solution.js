import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { validateEmail} from "../api/emailApi.js";
import cartIcon from "../assets/images/Icon.svg";
import dewaltImage from "../assets/images/dewalt-pro-700.jpg";
import metaboImage from "../assets/images/metabo-600.jpg";

const productImages = {
    "1": dewaltImage,
    "2": metaboImage,
};
/**
 * Solution Page
 */

// CTA button click handler
const handleCtaClick = () => {
    console.log("CTA button clicked");
    // TODO: Implement email form/modal
    document.querySelector("#form-modal")?.showModal();
};

const closeSecretOfferModal = () => {
    document.querySelector("#form-modal")?.close();
}

const handleSecretOfferSubmitButton = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
        return;
    }

    const formData = new FormData(form);
    const email = String(formData.get("email")).trim();
    const status = form.querySelector(".c-form-modal__status");
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    status.textContent = "Prebieha overenie emailovej adresy...";

    const result = await validateEmail(email);

    if (!result.success) {
        status.textContent = result.message || "Email sa nepodarilo overiť";
        submitButton.disabled = false;
        return;
    }

    form.reset();
    status.textContent = "";
    submitButton.disabled = false;

    document.querySelector("#form-modal")?.close();
    document.querySelector("#success-modal")?.showModal();
};

// Banner button click handler
const handleBannerClick = () => {
    console.log("Banner button clicked");
    // TODO: Navigate to products or filter
};

// Solution main banner
const solutionBanner = (banner) => html`
    <div class="c-solution-banner">
        <div class="c-solution-banner__image"></div>
        <div class="c-solution-banner__overlay"></div>
        <div class="c-solution-banner__content">
            <h1 class="c-solution-banner__content__title">${banner.title}</h1>
            <div class="c-solution-banner__content__description">${banner.description}</div>
            <button class="c-solution-banner__content__button" @click=${() => handleBannerClick()}>
                <span class="sb-text">${banner.ctaText}</span>
                <svg
                    class="sb-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.16663 10H15.8333M15.8333 10L9.99996 4.16669M15.8333 10L9.99996 15.8334"
                        stroke="currentColor"
                        stroke-width="1.67"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    </div>
`;

// Solution CTA section
const solutionCta = (ctaBanner) => html`
    <div class="c-solution-cta">
        <div class="c-solution-cta__image"></div>

        <div class="c-solution-cta__overlay"></div>

        <div class="c-solution-cta__content">
            <h2 class="c-solution-cta__content__title">${ctaBanner.title}</h2>

            <div class="c-solution-cta__content__description">${ctaBanner.description}</div>

            <button class="c-solution-cta__content__button" @click=${() => handleCtaClick()}>
                <span class="sc-text">${ctaBanner.ctaText}</span>

                <svg
                    class="sc-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.16663 10H15.8333M15.8333 10L9.99996 4.16669M15.8333 10L9.99996 15.8334"
                        stroke="currentColor"
                        stroke-width="1.67"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    </div>
`;

// Main page template

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

let cartNotificationTimeout;

const showCartNotification = (message, type = "success") => {
    const notification = document.querySelector("#cart-notification");

    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.className = `c-cart-notification c-cart-notification--${type}`;
    notification.hidden = false;

    clearTimeout(cartNotificationTimeout);
    cartNotificationTimeout = setTimeout(() => {
        notification.hidden = true;
    }, 3500);
};

const addProductToCart = (event, product) => {
    const card = event.currentTarget.closest(".c-product-card");
    const input = card.querySelector(".c-product-card__quantity-input");
    const quantity = Number(input.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        showCartNotification("Musíš vybrať aspoň 1 kus.", "warning");
        return;
    }

    if (quantity > 10) {
        showCartNotification("Naraz môžeš pridať najviac 10 kusov.", "warning");
        return;
    }

    showCartNotification(`Pridané do košíka: ${quantity} ks produktu ${product.name}.`, "success");
};

const productCard = (product) => html`
    <article class="c-product-card">
        <div class="c-product-card__image-area">
            <div class="c-product-card__badges">
                ${(product.badges ?? []).map((badge) => html`
                        <span class="c-product-card__badge c-product-card__badge--${badge.type}">${badge.label}</span>
                    `)}
            </div>
            <img class="c-product-card__image" src="${productImages[product.id] ?? product.imageUrl}" alt="${product.name}" loading="lazy"/>
        </div>

        <div class="c-product-card__rating" aria-label="Hodnotenie ${product.rating} z 5, ${product.reviewCount} recenzií">
            <span class="c-product-card__stars" aria-hidden="true">${Array.from({ length: 5 }, (_, index) => (index < product.rating ? "★" : "☆"))}</span>
            <span>(${product.reviewCount})</span>
        </div>

        <h3 class="c-product-card__name">${product.name}</h3>
        <p class="c-product-card__sku">${product.sku}</p>
        <p class="c-product-card__original-price">${formatPrice(product.originalPrice, product.currency, 0)}</p>
        <p class="c-product-card__sale-price">${formatPrice(product.salePrice, product.currency)}</p>
        <p class="c-product-card__vat-price">${formatPrice(product.priceWithoutVAT, product.currency)} bez DPH</p>
        <p class="c-product-card__stock">${product.stock}</p>

        <div class="c-product-card__purchase">
            <div class="c-product-card__quantity">
                <button type="button" aria-label="Znížiť množstvo" @click=${(event) => changeQuantity(event, -1)}>−</button>
                <input class="c-product-card__quantity-input" type="number" min="1" value="1" aria-label="Počet kusov"/>
                <button type="button" aria-label="Zvýšiť množstvo" @click=${(event) => changeQuantity(event, 1)}>+</button>
            </div>
            <button class="c-product-card__cart-button" type="button" @click=${(event) => addProductToCart(event, product)}>
                <img class="c-product-card__cart-icon" src="${cartIcon}" alt="" />Do košíka
            </button>
        </div>
    </article>
`;

export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

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
                            ${ data.products?.length ? html`
                                        <div class="c-product-grid">
                                            ${data.products.map((product) => productCard(product))}
                                        </div>
                                    `
                                    : html`<p>Momentálne nie sú dostupné žiadne produkty.</p>`
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="cart-notification" class="c-cart-notification" role="status" aria-live="polite" hidden></div>

            <div class="l-solution__categories">
                <div class="l-container">
                    <div class="c-solution-categories"></div>
                </div>
            </div>
            
            <dialog class="c-form-modal" id="form-modal" aria-labelledby="secret-offer-title">
                <button class="c-form-modal__close" type="button" aria-label="Zavrieť okno" @click=${closeSecretOfferModal}>&times;</button>
                <div class="c-form-modal__header">
                    <h2 id="secret-offer-title">Tajná ponuka produktov<br />Dewalt len pre Vás</h2>
                    <span><b>*</b> povinné polia</span>
                </div>
                <form class="c-form-modal__form" @submit=${handleSecretOfferSubmitButton}>
                    <label class="c-form-modal__field c-form-modal__field--full">
                        <span>E-mail <b>*</b></span> 
                        <input name="email" type="email" autocomplete="email"
                               pattern="[A-Za-z0-9.*%+\\-]{3,}@[A-Za-z0-9.\\-]{4,}\\.[A-Za-z]{2,}" required />
                    </label>
                    <label class="c-form-modal__field">
                        <span>Meno a priezvisko <b>*</b></span>
                        <input name="name" type="text" autocomplete="name" required />
                    </label>
                    <label class="c-form-modal__field">
                        <span>Telefónne číslo (mobil) <b>*</b></span>
                        <input name="phone" type="tel" autocomplete="tel" placeholder="+421 ___ ___ ___" pattern="\\+?[0-9][0-9 ]{5,18}[0-9]" required />
                    </label>
                    <label class="c-form-modal__field c-form-modal__field--full">
                        <span>Odkiaľ ste sa o tejto ponuke dozvedeli? <b>*</b></span>
                        <select name="source" required>
                            <option value="website" selected>Priamo z vášho webu</option>
                            <option value="social">Zo sociálnych sietí</option>
                            <option value="other">Inak</option>
                        </select>
                    </label>
                    <p class="c-form-modal__status" aria-live="polite"></p>
                    <div class="c-form-modal__actions c-form-modal__field--full">
                        <button class="c-form-modal__submit" type="submit">
                            <span>Získať tajnú ponuku</span>
                            <svg
                                    class="sc-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                        d="M4.16663 10H15.8333M15.8333 10L9.99996 4.16669M15.8333 10L9.99996 15.8334"
                                        stroke="currentColor"
                                        stroke-width="1.67"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                        <p>Odoslaním formulára súhlasíte so&nbsp;<a href="">spracovaním osobných údajov</a></p>
                    </div>
                </form>
            </dialog>

            <dialog class="c-success-modal" id="success-modal" aria-labelledby="success-modal-title">
                <button class="c-success-modal__close" type="button" aria-label="Zavrieť hlášku" @click=${() => document.querySelector("#success-modal")?.close()}>&times;</button>
                <h2 id="success-modal-title">Tajná ponuka bola odoslaná!</h2>
            </dialog>
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
