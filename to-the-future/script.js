async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const question = input.value.trim();

  if (!question) return;

  chatBox.innerHTML += `<p><b>Tu:</b> ${question}</p>`;
  input.value = "";

  try {
    const response = await fetch("https://future-backend-2lma.onrender.com/future", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    const reply = data.reply || "⚠️ Nessuna risposta dal futuro.";
    chatBox.innerHTML += `<p><b>Futuro:</b> ${reply}</p>`;
  } catch (error) {
    chatBox.innerHTML += `<p><b>Errore:</b> ${error.message}</p>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
