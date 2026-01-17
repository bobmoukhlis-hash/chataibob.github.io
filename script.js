console.log("🎤 ChatAI Bob – Microfono caricato");

let recognition;
let isListening = false;

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("❌ Microfono non supportato su questo dispositivo");
    return;
  }

  if (isListening) return;

  recognition = new SpeechRecognition();
  recognition.lang = "it-IT";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    console.log("🎙️ Microfono attivo");
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("🗣️ Detto:", text);

    const input = document.querySelector("input, textarea");
    if (input) input.value = text;
  };

  recognition.onerror = (e) => {
    console.error("Errore microfono:", e);
    alert("❌ Errore microfono o permesso negato");
  };

  recognition.onend = () => {
    isListening = false;
    console.log("⏹️ Microfono spento");
  };

  recognition.start();
}
