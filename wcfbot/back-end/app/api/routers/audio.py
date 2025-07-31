from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from typing import List, Optional
import logging
from app.api.models.user_request import UserRequestTTS

audio_router = r = APIRouter()
logger = logging.getLogger("uvicorn")
logger.info("Running On Audio Routers....")

@r.post("/text-to-speech", summary="Generate speech from text with Pawa AI", tags=["Audio"])
async def create_audio_request_tts(audioRequest:UserRequestTTS):
    pass 