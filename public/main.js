const eventFindForm = document.getElementById("form_eventFind");
const eventAddForm = document.getElementById("form_eventAdd");

// イベント検索処理
eventFindForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    const username = document.cookie.split("; ").find((row) =>
        row.startsWith("username=")
    );
    const response = await fetch("/find-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, ...eventData }),
    });

    const result = await response.json();

    if (response.ok) {
        console.log(result);
        const resultList =
            document.getElementById("search-result-table").getElementsByTagName(
                "tbody",
            )[0];

        while (resultList.firstChild) {
            resultList.removeChild(resultList.firstChild);
        }

        result.forEach((data) => {
            const tr = document.createElement("tr");
            const link = document.createElement("a");
            tr.innerHTML = `
                <td>${data.value.event_name}</td>
                <td>${data.value.event_start} ～ ${data.value.event_end}</td>
                <td>${data.value.event_location}</td>
            `;
            const td = document.createElement("td");
            link.classList.add("google-calendar-link");
            link.href = "#";
            link.textContent = "追加";
            link.addEventListener("click", (e) => {
                e.preventDefault();
                addEventForGoogleCalendar(data.value);
            });
            td.appendChild(link);
            tr.appendChild(td);
            resultList.appendChild(tr);
        });
        console.log(`検索結果: ${JSON.stringify(result)}`);
    } else {
        console.error(`エラー: ${result.message}`);
    }
});

// イベント追加処理
eventAddForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    const username = document.cookie.split("; ").find((row) =>
        row.startsWith("username=")
    );
    const resultDiv = document.getElementById("event-add-result");

    if (eventData.event_start > eventData.event_end) {
        resultDiv.textContent =
            "エラー : イベントの開始日時は終了日時より前である必要があります。";
        return;
    }

    const response = await fetch("/add-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, ...eventData }),
    });

    const result = await response.json();

    if (response.ok) {
        resultDiv.textContent = "イベント追加成功";
        event.target.reset();
        console.log(`イベント追加成功: ${JSON.stringify(result)}`);
    } else {
        resultDiv.textContent = `イベント追加失敗: ${result.message}`;
        console.error(`イベント追加エラー: ${result.message}`);
    }
});

const addEventForGoogleCalendar = (eventData) => {
    const eventTitle = encodeURIComponent(eventData.event_name);
    const eventDate = document.getElementById("date").value;
    const eventLocation = encodeURIComponent(eventData.event_location);

    const googleCalendarUrl =
        `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}&location=${eventLocation}`;

    globalThis.window.open(googleCalendarUrl);
};
