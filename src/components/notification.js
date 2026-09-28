let notificationTimeout;

export const showNotification = (message, type = "success") => {
    const notification = document.querySelector("#notification");

    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.className = `c-notification c-notification--${type}`;
    notification.hidden = false;

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.hidden = true;
    }, 3500);
};
