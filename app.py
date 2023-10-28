from flask import Flask, request, jsonify, render_template
from utils import prompts, gpt3, stable_diffusion, functions, audio, firestore
from flask_cors import CORS
import uuid

app = Flask(__name__)
# CORS(app)



@app.route('/', methods=['GET']) # To check if the server is running
def test():
    return render_template('welcome.html')


@app.route('/generate_story', methods=['POST']) # To generate the story
def generate_story():
    try:
        id = str(uuid.uuid4())
        story_array = functions.generate_new_story(functions.get_data_from_request(request))            
        generated_narration = audio.get_audio(story_array[0], id)
        story_quiz = functions.get_questions(story_array[0])
        response = {
            'status': 'success',
            'id': id,
            'uid': story_array[4],
            'story': story_array[1],
            'parts': story_array[2],
            'images': story_array[3],
            'audio': generated_narration,
            'questions': story_quiz
        } 
        
        firestore.store_story(response)
        return jsonify(response) 
    
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 400 
    
# @app.route('/stories', methods=['GET']) 

if __name__ == '__main__':
    app.run(debug=True) # Run the server in debug mode
