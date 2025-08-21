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
            resultList.appendChild(tr);
        });
        console.log(`検索結果: ${JSON.stringify(result)}`);
    } else {
        console.error(`エラー: ${result.message}`);
    }
});