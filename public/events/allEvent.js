globalThis.window.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch("/getAllEvents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const result = await response.json();

    if (response.ok) {
        console.log(result);
        const resultList = document.getElementById("event-table").getElementsByTagName("tbody")[0];

        while (resultList.firstChild) {
            resultList.removeChild(resultList.firstChild);
        }
        result.forEach(data => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${data.value.event_name}</td>
            <td>${data.value.event_start} ～ ${data.value.event_end}</td>
            <td>${data.value.event_location}</td>
            `;
            const td = document.createElement("td");
            const button = document.createElement("button");
            button.textContent = "予定を削除";
            button.addEventListener("click", (e) => {
                e.preventDefault();
                deleteEvent(data.key[2]);
            });
            td.appendChild(button);
            tr.appendChild(td);
            resultList.appendChild(tr);
        });
        console.log(`検索結果: ${JSON.stringify(result)}`);
    } else {
        console.error(`エラー: ${result.message}`);
    }
});

const deleteEvent = async (id) => {
    if (!globalThis.window.confirm("イベントを削除しますか？")) {
        return;
    }

    const password = globalThis.window.prompt("パスワードを入力してください", "", "password");

    const response = await fetch("/delete-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
    });
    const result = await response.json();

    if (response.ok) {
        console.log(result);
        // Remove the deleted event from the table
        const row = document.getElementById(`event-${id}`);
        if (row) {
            row.remove();
        }
    } else {
        console.error(`エラー: ${result.message}`);
    }

    globalThis.window.location.reload();
};