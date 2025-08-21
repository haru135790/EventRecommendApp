document.getElementById("registerForm").addEventListener(
    "submit",
    async function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        document.getElementById("message").textContent = ""; // メッセージを初期化

        if (!username || !password) {
            document.getElementById("message").textContent =
                "ユーザー名とパスワードを入力してください。";
            return;
        } else if (password.length < 6) {
            document.getElementById("message").textContent =
                "パスワードは6文字以上である必要があります。";
            return;
        } else if (username.length < 3) {
            document.getElementById("message").textContent =
                "ユーザー名は3文字以上である必要があります。";
            return;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            document.getElementById("message").textContent =
                "ユーザー名は英数字とアンダースコアのみ使用できます。";
            return;
        } else if (password === username) {
            document.getElementById("message").textContent =
                "ユーザー名とパスワードは同じにできません。";
            return;
        } else if (password.includes(username)) {
            document.getElementById("message").textContent =
                "パスワードにユーザー名を含めることはできません。";
            return;
        } else if (password !== confirmPassword) {
            document.getElementById("message").textContent =
                "パスワードが一致しません。";
            return;
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok) {
            alert("登録完了");
            location.href = "/login"; // 登録後にログインページへリダイレクト
        } else {
            document.getElementById("message").textContent = data.message;
        }
    },
);
