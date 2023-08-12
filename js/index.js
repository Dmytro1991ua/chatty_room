const chatContent = document.querySelector(".chat__content"),
  form = document.querySelector(".chat__form"),
  inputValue = document.querySelector(".chat__input");

const isSecureConnection = window.location.protocol === "https:";
const wsProtocol = isSecureConnection ? "wss://" : "ws://";

const socket = new WebSocket(`${wsProtocol}localhost:8080`);

function onAddNewMessage(message, isUserMessage) {
  if (message) {
    const customClass = isUserMessage ? "user" : "other";

    const html = `
       <p class="chat__message ${customClass}">${message}</p>
       `;

    const position = "beforeend";

    chatContent.insertAdjacentHTML(position, html);
  }
}

function onFormSubmit(e) {
  e.preventDefault();

  const message = inputValue.value;

  if (!message) {
    alert("Please enter a message");
  }

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "message", data: message }));

    onAddNewMessage(message, true);

    inputValue.value = "";
  } else {
    alert("WebSocket connection is not open.");
  }
}

socket.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);

  if (data.type === "message") {
    onAddNewMessage(data.data, false);
  }
});

form.addEventListener("submit", onFormSubmit);
