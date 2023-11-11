from flask import Flask, request, jsonify, render_template
from utils import functions
from utils import audio
from utils import firestore
from utils import speech_test
from utils import keys
from flask_cors import CORS
from difflib import SequenceMatcher
from scores import Score_data_handler
import uuid
import os

os.environ["OPENAI_API_KEY"] = keys.OPENAI_API_KEY
os.environ["REPLICATE_API_TOKEN"] = keys.REPLICATE_API_TOKEN
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = keys.GOOGLE_APPLICATION_CREDENTIALS

app = Flask(__name__)


CORS(app)

@app.route('/', methods=['GET'])  # To check if the server is running
def test():
    return render_template('welcome.html')


score_handler = Score_data_handler()

@app.route('/add_score', methods=['POST'])
def add_score():
    data = request.get_json()

    if 'child_id' not in data:
        return jsonify({'error': 'Child ID is required'}), 400

    child_id = data['child_id']
    score_handler.add_score_to_db(child_id)

    return jsonify({'message': 'Score updated successfully'}), 200


@app.route('/get_score/<child_id>', methods=['GET'])
def get_score(child_id):
    score = score_handler.current_score(child_id)

    if score is not None:
        return jsonify({'child_id': child_id, 'score': score}), 200
    else:
        return jsonify({'error': 'Score not found'}), 404

@app.route('/generate_story', methods=['POST'])  # To generate the story
def generate_story():
    try:
        id = str(uuid.uuid4())
        data = functions.get_data_from_request(request)
        story_array = functions.generate_new_story(data[0], data[1], data[2], data[3], data[4], data[5], data[6],
                                                   data[7], data[8])
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
            'cover_art': cover_art_link,
            'timestamp': firestore.timestamp,
            'name': data[1],
            'age': data[2],
        }

        firestore.store_story(response)
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


@app.route('/expand_story', methods=['POST'])  # To generate the story
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
    app.run(debug=True)  # Run the server in debug mode
