export const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const toastMessage = (message, toastMessageColorCssClassName='') => {
    document.body.insertAdjacentHTML(
        "beforeend",
        `
            <div class="toast_message js-toast_message ${toastMessageColorCssClassName}">
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