import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not configured.")

client = Groq(api_key=GROQ_API_KEY)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@app.get("/")
def root():
    return {
        "message": "AI Developer Assistant API is running"
    }


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an AI Developer Assistant. "
                    "Help the user with programming, debugging, "
                    "software development, architecture, code review, "
                    "and technical questions. "
                    "Give clear, accurate, practical answers."
                ),
            }
        ]

        messages.extend(
            {
                "role": message.role,
                "content": message.content,
            }
            for message in request.messages
            if message.role in {"user", "assistant"}
            and message.content.strip()
        )

        if not request.messages:
            raise HTTPException(
                status_code=400,
                detail="At least one message is required.",
            )

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
        )

        return {
            "reply": response.choices[0].message.content
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"AI request failed: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response.",
        )