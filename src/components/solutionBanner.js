import { html } from "lit-html";

// Banner button click handler
const handleBannerClick = () => {
    console.log("Banner button clicked");
    // TODO: Navigate to products or filter
};

export const boldPhrase = (description, textToBold) => {
    const text = String(description ?? "");
    const start = text.indexOf(textToBold);

    if (start === -1) {
        return text;
    }

    const end = start + textToBold.length;

    return html` ${text.slice(0, start)}<strong>${textToBold}</strong>${text.slice(end)} `;
};

// Solution main banner
export const solutionBanner = (banner) => html`
    <div class="c-solution-banner">
        <div class="c-solution-banner__image"></div>
        <div class="c-solution-banner__overlay"></div>
        <div class="c-solution-banner__content">
            <h1 class="c-solution-banner__content__title">${banner.title}</h1>
            <div class="c-solution-banner__content__description">
                ${boldPhrase(
                    banner.description,
                    "vŕtačky R-driller so zľavami až do 40 %. Spoľahlivý výkon, precízne spracovanie a dlhá životnosť"
                )}
            </div>
            <button class="c-solution-banner__content__button" @click=${handleBannerClick}>
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
