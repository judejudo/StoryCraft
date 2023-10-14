from flask import Flask, request, jsonify
from utils import prompts, gpt3, stable_diffusion

app = Flask(__name__)

@app.route('/', methods=['GET'])
def test():
    return "Flask server is running successfully!"

@app.route('/generate_story', methods=['POST'])
def generate_story():
    try:
        data = request.get_json()
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
        parts = story.split("\n\n")
        parts = [part for part in parts if len(part) > 0]

        story_with_images = ""
        for i, part in enumerate(parts):
            if "replicate.com" not in part:
                story_with_images += part + "\n\n"
            else:
                image_url = part
                story_with_images += image_url + "\n\n"

        response = {
            'status': 'success',
            'story': story_with_images
        }

        return jsonify(response)
    except Exception as e:
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 400

if __name__ == '__main__':
    app.run(debug=True)
