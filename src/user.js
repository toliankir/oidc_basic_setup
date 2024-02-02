const apiServiceUrl = new URL("http://localhost:4001");

const formRegistrationEl = document.querySelector("#registrationForm");
const inputLoginEl = document.querySelector("#inputLogin");
const inputPasswordEl = document.querySelector("#inputPassword");
const invalidFeedbackEl = document.querySelector("#invalidFeedback");

formRegistrationEl.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    invalidFeedbackEl.innerHTML = "";
    const login = inputLoginEl.value;
    const password = inputPasswordEl.value;
    if (!login) {
        inputLoginEl.classList.add("is-invalid")
    }
    if (!password) {
        inputPasswordEl.classList.add("is-invalid")
    }
    if (!login || !password) {
        return;
    }
    inputLoginEl.classList.remove("is-invalid")
    inputPasswordEl.classList.remove("is-invalid")

    const userCreateUrl = new URL("user", apiServiceUrl);
    try {
        const response = await fetch(userCreateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login,
                password
            })
        })

        if (!response.ok) {
            const responseObj = await response.json();
            invalidFeedbackEl.innerHTML = responseObj.error;
        } else {
            invalidFeedbackEl.innerHTML = `User ${login} created`;
        }
    } catch (error) {

        console.error(error);
    }
});
