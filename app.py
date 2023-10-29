from flask import Flask, request, jsonify, render_template
from utils import  functions, audio, firestore, speech_test,keys
from flask_cors import CORS
from difflib import SequenceMatcher
import uuid
import os
os.environ["OPENAI_API_KEY"] = keys.OPENAI_API_KEY
os.environ["REPLICATE_API_TOKEN"] = keys.REPLICATE_API_TOKEN
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = keys.GOOGLE_APPLICATION_CREDENTIALS

app = Flask(__name__)
# CORS(app)

@app.route('/', methods=['GET']) # To check if the server is running
def test():
    return render_template('welcome.html')


@app.route('/generate_story', methods=['POST']) # To generate the story
def generate_story():
    try:
        id = str(uuid.uuid4())
        data = functions.get_data_from_request(request)
        story_array = functions.generate_new_story(*data)
        generated_narration = audio.get_audio(story_array[0], id)
        story_quiz = functions.get_questions(story_array[0])
        cover_art_link = functions.get_cover_art(story_array[5], story_array[6])
        
        response = {
            'status': 'success',
            'id': id,
            'uid': story_array[4],
            'story': story_array[1],
            'parts': story_array[2],
            'images': story_array[3],
            'audio': generated_narration,
            'questions': story_quiz,
            'cover_art': cover_art_link
        } 
        
        # firestore.store_story(response)
        return jsonify(response) 
    
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        print(response)
        return jsonify(response), 400 
    
@app.route('/compare_audio', methods=['POST']) 
def compare_audio():
    try:
        data = request.get_json()
        print(data)
        url = data.get('url', "")
        test_text = data.get('text', "")
        read_text = speech_test.transcribe_file(url)
        similarity = SequenceMatcher(None, test_text, read_text).ratio()
        response = {
            'status': 'success',
            'similarity': similarity,
            'verdict': 'passed' if similarity > 0.8 else 'failed'
        }
        return jsonify(response)
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        print(response)
        return jsonify(response), 400
        
        
@app.route('/expand_story', methods=['POST']) # To generate the story
def expand_story():
    try:
        id = str(uuid.uuid4())
        data = request.get_json()
        story = data.get('story', "")
        additions = data.get('additions', "")
        story_array = functions.expand_story(story, additions)
        story_quiz = functions.get_questions(story_array[0])
        cover_art_link = functions.get_cover_art(story_array[5], story_array[6])
        
        story_array = functions.expand_story(story, additions)
        generated_narration = audio.get_audio(story_array[0], id)
        
        
        response = {
            'status': 'success',
            'id': id,
            'uid': story_array[4],
            'story': story_array[1],
            'parts': story_array[2],
            'images': story_array[3],
            'audio': generated_narration,
            'questions': story_quiz,
            'cover_art': cover_art_link
        } 
        
        firestore.store_story(response)
        return jsonify(response) 
    
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 400


if __name__ == '__main__':
    app.run(debug=True) # Run the server in debug mode
