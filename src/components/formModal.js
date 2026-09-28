import { html } from "lit-html";

import { validateEmail } from "../api/emailApi.js";
import { showNotification } from "./notification.js";

import xIcon from "../assets/images/icons/x_icon.svg";
import downArrow from "../assets/images/icons/arrow_down.svg";

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
    showNotification("Tajná ponuka bola úspešne odoslaná.", "email-success");
};

export const formModal = () => html`
    <dialog class="c-form-modal" id="form-modal" aria-labelledby="secret-offer-title">
                <button class="c-form-modal__close" type="button" aria-label="Zavrieť okno" @click=${closeSecretOfferModal}>
                    <img class="c-form-modal__close-icon" src=${xIcon} alt="" />
                </button>
                <div class="c-form-modal__header">
                    <h2 id="secret-offer-title">Tajná ponuka produktov<br />Dewalt len pre Vás</h2>
                    <span><b>*</b> povinné polia</span>
                </div>
                <form class="c-form-modal__form" @submit=${handleSecretOfferSubmitButton}>
                    <label class="c-form-modal__field c-form-modal__field--full">
                        <span>E-mail <b>*</b></span> 
                        <input name="email" type="email" autocomplete="email"
                               pattern="[A-Za-z]{3,}@[A-Za-z]{4,}\\.[A-Za-z]{2,}" required />
                    </label>
                    <label class="c-form-modal__field">
                        <span>Meno a priezvisko <b>*</b></span>
                        <input name="name" type="text" autocomplete="name" required />
                    </label>
                    <label class="c-form-modal__field">
                        <span>Telefónne číslo (mobil) <b>*</b></span>
                        <input name="phone" type="tel" autocomplete="tel" placeholder="+421 _ _ _  _ _ _  _ _ _"
                               pattern="\\+[0-9]{3} [0-9]{3} [0-9]{3} [0-9]{3}" required />
                    </label>
                    <label class="c-form-modal__field c-form-modal__field--full">
                        <span>Odkiaľ ste sa o tejto ponuke dozvedeli? <b>*</b></span>
                        <div class="c-form-modal__select-wrap">
                            <select name="source" required>
                                <option value="website" selected>Priamo z vášho webu</option>
                                <option value="social">Zo sociálnych sietí</option>
                                <option value="other">Inak</option>
                            </select>

                            <img class="c-form-modal__select-arrow" src=${downArrow} alt="" />
                        </div>
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
`;