const eventFindForm = document.getElementById("form_eventFind");
const eventAddForm = document.getElementById("form_eventAdd");

eventFindForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    const response = await fetch("/find-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
    });

    const result = await response.json();

    if (response.ok) {
        console.log(result);
        const resultList = document.getElementById("search-result-list");
        resultList.innerHTML = ""; // 既存の内容をクリア

        result.forEach(event => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            li.textContent = `${event.name} - ${event.date} - ${event.location} `;
            link.classList.add("google-calendar-link");
            link.href = "#";
            link.textContent = "Google Calendarに追加";
            link.addEventListener("click", (e) => {
                e.preventDefault();
                addEventForGoogleCalendar(event);
            });
            li.appendChild(link);
            resultList.appendChild(li);
        });
        console.log(`検索結果: ${JSON.stringify(result)}`);
    } else {
        console.error(`エラー: ${result.message}`);
    }

    });

eventAddForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    const resultDiv = document.getElementById("event-add-result");

    const response = await fetch("/add-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
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
    const eventTitle = encodeURIComponent(eventData.name);
    const eventDate = document.getElementById("day").value;
    const eventLocation = encodeURIComponent(eventData.location);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&location=${eventLocation}`;

    globalThis.window.open(googleCalendarUrl, '_blank');
};
