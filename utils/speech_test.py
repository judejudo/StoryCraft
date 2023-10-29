from google.cloud import speech


def transcribe_file(speech_file: str) -> speech.RecognizeResponse:
    """Transcribe the given audio file."""
    client = speech.SpeechClient()

    with open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding="FLAC",
        # sample_rate_hertz=16000,
        language_code="en-US",
    )
    
    """Uncomment this if you want to use Google Cloud Storage"""
    # audio = speech.RecognitionAudio(uri="uri")
    # config = speech.RecognitionConfig(
    #     encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
    #     sample_rate_hertz=16000,
    #     language_code="en-US",
    # )

    response = client.recognize(config=config, audio=audio)
    alternatives = []
    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        alternatives.append(result.alternatives[0].transcript)

    return alternatives
