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