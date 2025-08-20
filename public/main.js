const eventfindform = document.getElementById("form_eventFind");
const eventaddform = document.getElementById("form_eventAdd");

eventfindform.addEventListener("submit", async (event) => {
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
            link.href = "#";
            link.textContent = "Google Calendarに追加";
            link.addEventListener("click", (e) => {
                e.preventDefault();
                addEventforGoogleCalendar(event);
            });
            li.appendChild(link);
            resultList.appendChild(li);
        });
        console.log(`検索結果: ${JSON.stringify(result)}`);
    } else {
        console.error(`エラー: ${result.message}`);
    }

    });

eventaddform.addEventListener("submit", (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    console.log(`入力欄の値: ${JSON.stringify(eventData)}`);
});

const addEventforGoogleCalendar = (eventData) => {
    const eventTitle = encodeURIComponent(eventData.name);
    const eventDate = document.getElementById("day").value;
    const eventLocation = encodeURIComponent(eventData.location);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&location=${eventLocation}`;

    window.open(googleCalendarUrl, '_blank');
};
