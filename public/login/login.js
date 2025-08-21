document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('error').textContent = '';
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            throw new Error('ログインに失敗しました');
        }
        // ログイン成功時の処理
        const result = await response.json();
        document.cookie = `username=${username} ; path=/; max-age=604800`; // 1週間有効なクッキーを設定
        location.href = "/";
    } catch (err) {
        document.getElementById('error').textContent = err.message;
    }
});
