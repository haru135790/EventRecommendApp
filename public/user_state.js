const username = document.cookie.split('; ').find(row => row.startsWith('username='));

// ユーザーがログインしている場合の処理
if (username) {
    document.getElementById("login_link").textContent = "ログアウト";
    document.getElementById("login_link").href = "/logout";
    document.getElementById("login_link").addEventListener("click", (event) => {
        event.preventDefault();
        if (!confirm("ログアウトしますか？")) {
            return;
        }
        document.cookie = "username=; path=/; max-age=0"; // クッキーを削除
        location.reload(); // ページをリロード
    });
    const loggedIn_username = username.split('=')[1];
    document.getElementById("account_info").textContent = `${loggedIn_username} でログイン中`;
}
