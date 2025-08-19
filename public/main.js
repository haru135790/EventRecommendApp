const eventfindform = document.getElementById("form_eventFind");
const eventaddform = document.getElementById("form_eventAdd");

eventfindform.addEventListener("submit", (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    console.log(`入力欄の値: ${JSON.stringify(eventData)}`);
});

eventaddform.addEventListener("submit", (event) => {
    event.preventDefault(); // submitイベントの本来の動作を止める
    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    console.log(`入力欄の値: ${JSON.stringify(eventData)}`);
});

const addEventforGoogleCalendar = (eventData) => {
    const eventTitle = encodeURIComponent(eventData.title);
    const eventDate = document.getElementById("day").value;
    const eventLocation = encodeURIComponent(eventData.location);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventDate}&location=${eventLocation}`;

    window.open(googleCalendarUrl, '_blank');
};
