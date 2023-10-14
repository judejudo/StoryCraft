import pyttsx3

def test_speak():
    engine = pyttsx3.init()
    engine.say("Hello World")
    engine.runAndWait()

def test_set_voice():
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id)
    engine.say("Hello World")
    engine.runAndWait()

def test_set_rate():
    engine = pyttsx3.init()
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate+50)
    engine.say("Hello World")
    engine.runAndWait()

def test_set_volume():
    engine = pyttsx3.init()
    volume = engine.getProperty('volume')
    engine.setProperty('volume', volume-0.25)
    engine.say("Hello World")
    engine.runAndWait()