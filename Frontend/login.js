const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (!username || !password) {
        message.style.color = "red";
        message.innerHTML = "Please enter your username and password.";
        return;
    }

    try {
        const response = await fetch(
            "https://app-2b50813e-61a2-41f7-beb4-a39824980e68.cleverapps.io/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.innerHTML = data.message || "Login failed.";
            return;
        }

        // Login successful
        message.style.color = "green";
        message.innerHTML = "Login Successful!";

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // Go to dashboard
        setTimeout(() => {
            window.location.href = "indexdash.html";
        }, 1000);

    } catch (error) {
        console.error("Login error:", error);

        message.style.color = "red";
        message.innerHTML = "Unable to connect to the server.";
    }
});
