console.log("✅ ChatAI Bob – script.js caricato");

// =========================
//  VOCE (TTS) - ON/OFF
// =========================
let VOICE_ON = true;

function setVoice(on) {
  VOICE_ON = !!on;
  console.log("🔊 Voce:", VOICE_ON ? "ON" : "OFF");
}

function toggleVoice() {
  setVoice(!VOICE_ON);
  // se hai un bottone con id="voiceBtn" aggiorna testo
  const b = document.getElementById("voiceBtn");
  if (b) b.textContent = VOICE_ON ? "🔊 Voce: ON" : "🔇 Voce: OFF";
}

// auto lingua semplice
function detectLang(text) {
  // se contiene arabo
  if (/[ء-ي]/.test(text)) return "ar-SA";

  // se sembra inglese (molte parole inglesi comuni)
  const enHints = ["the", "and", "you", "your", "what", "how", "can", "please"];
  const lower = (text || "").toLowerCase();
  const hits = enHints.filter(w => lower.includes(" " + w + " ") || lower.startsWith(w + " ")).length;

  return hits >= 2 ? "en-US" : "it-IT";
}

function speakText(text) {
  try {
    if (!VOICE_ON) return;
    if (!text || !window.speechSynthesis) return;

    // stop eventuale voce precedente
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = detectLang(text);

    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.error("Errore TTS:", e);
  }
}

// =========================
//  MICROFONO (Speech to Text)
// =========================
let recognition;
let isListening = false;

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("❌ Microfono non supportato su questo dispositivo");
    return;
  }
  if (isListening) return;

  recognition = new SpeechRecognition();
  recognition.lang = "it-IT";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => { isListening = true; console.log("🎙️ Microfono attivo"); };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("🗣️ Detto:", text);

    // prova a trovare input/textarea della chat
    const input = document.querySelector("#userInput") || document.querySelector("input, textarea");
    if (input) input.value = text;
  };

  recognition.onerror = (e) => {
    console.error("Errore microfono:", e);
    alert("❌ Errore microfono o permesso negato");
  };

  recognition.onend = () => { isListening = false; console.log("⏹️ Microfono spento"); };

  recognition.start();
}

// =========================
//  AGGANCIO ALLA TUA CHAT
//  (IMPORTANTE)
// =========================
// 1) Se la tua chat ha una funzione che stampa il messaggio del BOT,
//    dopo averlo stampato chiama:  speakText(botText)
//
// Esempio:
// function addBotMessage(botText){
//    ... stampa ...
//    speakText(botText);
// }
//
// 2) Se non sai dove metterlo, attivo anche un “listener” automatico:
//    se esiste un elemento con id="chatBox", quando arriva un nuovo
//    messaggio del bot (classe .bot / .assistant) prova a leggerlo.
const chatBox = document.getElementById("chatBox");
if (chatBox && window.MutationObserver) {
  const obs = new MutationObserver(() => {
    const last =
      chatBox.querySelector(".bot:last-child, .assistant:last-child, .bot-message:last-child");
    if (last) {
      const t = (last.innerText || "").trim();
      if (t) speakText(t);
    }
  });
  obs.observe(chatBox, { childList: true, subtree: true });
}

// Se hai un bottone voce con id="voiceBtn", lo inizializza
document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("voiceBtn");
  if (b) b.textContent = VOICE_ON ? "🔊 Voce: ON" : "🔇 Voce: OFF";
});
