import requests
from flask import Flask, request, jsonify
from utils import prompts, gpt3, stable_diffusion
from google.cloud import firestore
from keys import eleven_key
from elevenlabs import set_api_key

app = Flask(__name__)

db = firestore.Client(project='a2sv-hackathon')
set_api_key(eleven_key)
CHUNK_SIZE = 1024
speech_url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"

@app.route('/', methods=['GET'])
def test():
    return "Flask server is running successfully!"

@app.route('/generate_story', methods=['POST'])
def generate_story():
    try:
        data = request.get_json()
        uid = data.get('uid', "")
        name = data.get('name', "")
        age = data.get('age', "")
        choices = data.get('choices', {})

        language = choices.get('language', "")
        favorite_animal = choices.get('favorite_animal', "")
        exciting_place = choices.get('exciting_place', "")
        special_interest = choices.get('special_interest', "")
        superhero = choices.get('superhero', "")
        mood = choices.get('mood', "")


        plot = f"Short story of at least 5 paragraphs for a person named {name} who is {age} whose favorite animal is {favorite_animal}. They love to visit {exciting_place} and enjoy {special_interest}.  {superhero} appear. {mood}. Write the story in {language} "
        story = ""
        
        if len(plot) == 0:
            try:
                plot_prompt = prompts.plot()
                plot = gpt3.generate_with_prompt(plot_prompt, 0.8)
            except Exception as e:
                print(e)
                
        for _ in range(10):
            if len(story.split(". ")) < 20:
                try:
                    story_prompt = prompts.story_expansion(story)
                    story = gpt3.generate_with_prompt(story_prompt, 0.6)
                except Exception as e:
                    print(e)

        # Combine the story with images
        img_list = []
        parts = story.split("\n\n")
        parts = [part for part in parts if len(part) > 0]
        story_with_images = ""
        for i, part in enumerate(parts):
            if "replicate.com" not in part:
                story_with_images += part + "\n\n"
            else:
                image_url = part
                story_with_images += image_url + "\n\n"
                 
            if "replicate.com" not in story:
                try:
                    image_prompt = prompts.illustration(f"{plot}\n\n{'' if i == 0 else parts[i - 1]}\n\n{part}")
                    image_url = stable_diffusion.generate_image(image_prompt)
                    img_list.append(image_url)
                    story_with_images += image_url + "\n\n"
                except Exception as e:
                    print(e)
                    
                
        story_data = {
            'uid': uid,
            'story': story_with_images,
            'timestamp': firestore.SERVER_TIMESTAMP
        }
        
        stories_ref = db.collection('stories')
        stories_ref.add(story_data)

        response = {
            'status': 'success',
            'uid': uid,
            'story': story_with_images,
            'parts': parts,
            'images': img_list
        }
        
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
        
        with open('output.mp3', 'wb') as f:
            for chunk in audio_response.iter_content(chunk_size=CHUNK_SIZE):
             if chunk:
                f.write(chunk)
        

        return jsonify(response)
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 400

if __name__ == '__main__':
    app.run(debug=True)
