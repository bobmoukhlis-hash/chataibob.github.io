async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("Tu", message);
  input.value = "";

  // Per ora risposta simulata
  addMessage("🔮 To The Future", "Sto osservando il futuro... ✨");
}

function addMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = sender === "Tu" ? "user-message" : "ai-message";
  msg.innerText = `${sender}: ${text}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}
