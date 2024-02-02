
const loginBtnEl = document.querySelector("#loginBtn");
const testBtnEl = document.querySelector("#testBtn");
const loginFormEl = document.querySelector("#loginForm");
const logoutFormEl = document.querySelector("#logoutForm");
const registerFormEl = document.querySelector("#registerForm");
const testFormEl = document.querySelector("#testForm");
const testFormBodyEl = document.querySelector("#testFormBody");
const logoutBtnEl = document.querySelector("#logoutBtn");

loginBtnEl.addEventListener("click", () => {
    userManager
        .signinRedirect(window.location.href)
        .then((data) => {
            console.log("data:", data);
        })
        .catch((e) => {
            console.log("err:", e);
        });
});

//

testBtnEl.addEventListener('click', async () => {
    const user = await userManager.getUser();
    const response = await fetch("http://localhost:4001/user", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.id_token}`
        }
    });

    if (!response.ok) {
        return;
    }

    const responseObj = await response.json();
    testFormBodyEl.innerHTML = JSON.stringify(responseObj, "", "  ");
});

logoutBtnEl.addEventListener("click", async () => { 
    await userManager.signoutCallback();
    await userManager.removeUser();
    await init();
});

async function init() {
    const user = await userManager.getUser();
    if (user) {
        loginFormEl.classList.add("d-none");
        registerFormEl.classList.add("d-none");
        logoutFormEl.classList.remove("d-none");
        testFormEl.classList.remove("d-none");
    } else {
        testFormEl.classList.add("d-none");
        logoutFormEl.classList.add("d-none");
        loginFormEl.classList.remove("d-none");
        registerFormEl.classList.remove("d-none");
    }
}
init();
