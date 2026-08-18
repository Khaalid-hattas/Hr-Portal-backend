const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed.");
            return;
        }

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save logged-in user
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // Go to dashboard
        window.location.href = "indexdash.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to the server.");
    }
});