export const toastMessage = (message) => {
    document.body.insertAdjacentHTML(
        "beforeend",
        `
            <div class="toast_message js-toast_message">
                <span class="toast_message_text">${message}</span>
            </div>
        `
        )

    const toastMessage = document.querySelector(".js-toast_message");
    toastMessage.classList.add("toast_animation");

    toastMessage.addEventListener("animationend", (event) =>{
        toastMessage.classList.remove("toast_animation");
        toastMessage.remove();
    });
}