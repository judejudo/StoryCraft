import os

from .keys import eleven_key
from elevenlabs import set_api_key
import requests

set_api_key(eleven_key)
CHUNK_SIZE = 1024
speech_url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"


def get_audio(story, audio_name):
    # Request headers for eleven labs API
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": eleven_key
    }

    audio_data = {
        "text": story.strip("\n\n"),
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    audio_response = requests.post(speech_url, json=audio_data, headers=headers)
    audio = "./story_narrations/" + audio_name + ".mp3"
    print(audio)
    with open(audio, 'wb') as f:
        for chunk in audio_response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)

    return audio_name + ".mp3"
