document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = form.name.value;
        const password = form.password.value;

        // Hardcoded admin credentials
        const adminUsername = "admin";
        const adminPassword = "admin123";

        localStorage.setItem("user", "admin");
        localStorage.setItem("password", "admin123");

        if (username === adminUsername && password === adminPassword) {
            alert("Login successful!");
            localStorage.setItem("user", "admin")
            window.location.href = "/adminpanel";
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });
});


