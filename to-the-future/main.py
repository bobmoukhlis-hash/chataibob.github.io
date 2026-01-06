from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

# ✅ Abilita CORS per permettere richieste dal tuo sito GitHub
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puoi anche mettere ["https://bobmoukhlis-hash.github.io"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "✅ To The Future backend is running!"}

# 🔮 Endpoint che risponde alle domande dal frontend
@app.post("/future")
async def future(request: Request):
    data = await request.json()
    question = data.get("question", "")

    # Ottieni la chiave API Groq dall’ambiente (Render)
    groq_api_key = os.getenv("GROQ_API_KEY")

    if not groq_api_key:
        return {"reply": "⚠️ Errore: chiave Groq non trovata."}

    # Prompt per Groq
    prompt = f"Immagina di rispondere come un oracolo del futuro. Domanda: {question}"

    # 🔗 Richiesta a Groq API
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mixtral-8x7b-32768",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.8,
            },
        )

        result = response.json()
        reply = result["choices"][0]["message"]["content"]
        return {"reply": reply}

    except Exception as e:
        return {"reply": f"❌ Errore nella connessione a Groq: {e}"}
