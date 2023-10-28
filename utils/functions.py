
import gpt3, prompts, stable_diffusion
import json

def get_data_from_request(request):
    '''Get data from the request object and return it as a tuple'''
    data = request.get_json()
    uid = data.get('uid', "")
    name = data.get('name', "")
    age = data.get('age', "")
    choices = data.get('choices', {})

    language = choices[0].get('language', "")
    favorite_animal = choices[0].get('favorite_animal', "")
    exciting_place = choices[0].get('exciting_place', "")
    special_interest = choices[0].get('special_interest', "")
    superhero = choices[0].get('superhero', "")
    mood = choices[0].get('mood', "")
    return uid, name, age, language, favorite_animal, exciting_place, special_interest, superhero, mood


def generate_new_story(uid, name, age, language, favorite_animal, exciting_place, special_interest, superhero, mood):
    '''Generate a new story from the given parameters'''
    plot = f"Short story of at least 5 paragraphs for a person named {name} who is {age} whose favorite animal is {favorite_animal}. They love to visit {exciting_place} and enjoy {special_interest}.  {superhero} appear. {mood}. Write the story in {language} "
    story = ""

    if len(plot) == 0:
        try:
            plot_prompt = prompts.plot()
            plot = gpt3.generate_with_prompt(plot_prompt, 0.8)
        except Exception as e:
                print(e)
            #Create story prompt and Prompt GPT-3 to generate the story
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
    #Get image links from stable diffusion, Add them between the story parts
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
                    
    return [story,story_with_images,parts,img_list,uid] 

def get_questions(story):
    answer_format = '{"questions": [{"question": "What is the name of the curious child in the story?","options":["Emily", "Lily", "Mia", "Noah"],"answer": "Lily"}]}'
    questions = json.loads(gpt3.generate_with_prompt(f"Generate questions in the format {answer_format} from the following story: \n {story} ",0.7))
    return(questions)